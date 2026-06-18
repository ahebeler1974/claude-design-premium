# Reanalysis  -  2026-06-18 (bound state, Builder/Consumer architecture)

Read-only audit of the harness in its **bound** state (DS: "Lendár[IA] Design System",
`hostMode: consumer`, 21 components). Every finding below was verified directly against the file at
the cited line. No files were edited to produce this report.

> **Validity note:** this report was written while the repo was being edited in parallel. Line
> numbers reflect the state at 2026-06-18 ~16:10. **Re-confirm each `file:line` before applying**  -
> some files moved after the audit. Specifically, `synthesize-design-md.mjs` changed after F1 was
> recorded; re-check whether the `name`/`namespace` guard is still missing before acting on F1.
> F3, F4, F6, F7 were re-verified as still valid at 16:11.

## Context

The harness improved substantially since the prior audit. Confirmed working (not courtesy):

- `file-snapshot.mjs` has a correct atomic rollback (capture before, restore on catch); used by
  `bootstrap-harness.mjs` and `unbind-harness.mjs`.
- Exit codes 0/1/2/3 are distinct across scripts.
- Builder vs Consumer detection works; `BOUND_DS.json` matches what the scripts expect.
- New public prose (PLAYBOOK, adapters) is clean of em-dashes.
- A CI workflow exists and runs the detectors.

The findings below are the remaining real improvements, grouped into two patterns.

---

## Pattern 1  -  Missing input validation in new scripts (highest risk)

The new scripts assume `BOUND_DS.json` / manifest are well-formed. When they are not, the scripts
fail **silently** or crash with an opaque stack instead of a readable error. This collides with the
repo rule `extraction-no-fallbacks` (a silent empty fallback is a false positive).

### F1 (HIGH)  -  `synthesize-design-md.mjs:59-60`

```js
const name = binding.name;       // no guard
const ns = binding.namespace;    // no guard
```

`components`/`cards`/`readme` use `??` fallbacks (lines 58, 61, 62) but `name` and `namespace` do
not. A partial or malformed `binding` yields a `DESIGN.md` containing `undefined`, which then ships
as if synthesized.

**Fix:** guard at the top of `synthesizeDesignMd()`:
```js
if (!binding?.namespace || !binding?.name) {
  throw new Error('BOUND_DS missing namespace or name; cannot synthesize DESIGN.md');
}
```

### F2 (HIGH)  -  `extract-ds-tokens.mjs:44-48`

```js
const paths = (binding.globalCssPaths ?? []).slice(0, 4);
let corpus = '';
for (const rel of paths) corpus += `${read(cwd, importPath(binding, rel))}\n`;
```

`read()` returns `''` on a missing file. If every token CSS is absent, `corpus` is empty and the
extracted `colors`/`fonts`/`spacing` are all `[]`  -  with no warning. `DESIGN.md` then synthesizes
with empty token data and looks complete.

**Fix:** count hits and warn to stderr when zero CSS files were found:
```js
let found = 0;
for (const rel of paths) {
  const content = read(cwd, importPath(binding, rel));
  if (content) found++;
  corpus += content + '\n';
}
if (found === 0) process.stderr.write(`Warning: no token CSS found in: ${paths.join(', ')}\n`);
```

### F3 (HIGH)  -  `detect-bound-ds.mjs:27-32`

```js
function readJson(root, rel) {
  try { return JSON.parse(read(root, rel)); }
  catch { return null; }   // silent
}
```

A malformed `_ds_manifest.json` returns `null`, which later crashes at `manifest.namespace` with a
`TypeError` instead of a readable "manifest is invalid JSON" message.

**Fix:** throw with context instead of returning null:
```js
catch (err) { throw new Error(`Failed to parse ${rel}: ${err.message}`); }
```
(Verify that the two existing `catch { ... return null }` branches at lines 30 and 131 are the same
pattern; line 131 reads `BOUND_DS.json` and may legitimately want a soft null  -  decide per call site.)

---

## Pattern 2  -  Pointwise consistency defects

### F4 (HIGH)  -  `DESIGN.md:24-30` anti-references are corrupted

The "Anti-references" list shipped malformed (verified):

```
- no (LMS)**  -  courses, tracks ("trilhas"), live sessions, certificates, gamification
- no para dados/status e ouro como sinal de estado
- no shimmer sweeps, no gold glows/auras, no PNG textures, no generic rounded-card sh
- no chips, tinted alerts), never blocks
```

Line 25 starts mid-fragment, line 26 has no subject, line 27 truncates at `sh`, line 30 has an
orphan `)`. This is the visible identity doc, so the damage is user-facing. Likely a bad synthesis
pass.

**Fix:** re-read the bound DS readme
(`_ds/academia-ds-460d36aa-7bb2-48dc-9ede-f9e8954fcdb3/readme.md`) and restore the complete
anti-reference sentences, then re-run `synthesize-design-md.mjs` if it is the generator, OR fix the
synthesis template that produced the fragments.

### F5 (MEDIUM)  -  Two `isBuilderRoot()` with opposite semantics

- `ds-paths.mjs:7`  -  `isBuilderRoot(binding)` checks binding **fields** (`hostMode`/`root`/`bindingSource`).
- `detect-bound-ds.mjs:52`  -  `isBuilderRoot(root)` checks **filesystem** (manifest + bundle exist).

Same name, opposite inputs. A caller importing the wrong one fails silently. (Currently no
cross-import, so no live breakage  -  but the collision is a trap.)

**Fix:** rename one. Suggest `ds-paths.mjs` -> `isBuilderBinding(binding)`; add a one-line comment in
each file noting the distinction.

### F6 (MEDIUM)  -  CI detectors are non-blocking

`.github/workflows/ci.yml:55,72,78` run `test-builder-bootstrap`, `detect-canvas-antipatterns`, and
`detect-text-antipatterns` with `continue-on-error: true`. This is a documented soft-rollout (lines
8-9), so it is intentional  -  but today the CI is **observational**, not a gate. A P1 finding does not
fail the build.

**Fix (when ready to promote):** drop `continue-on-error` on the detectors, or add a dedicated
strict gate step. Mirror the repo's Squawk soft->block rollout pattern (telemetry window, then flip).

### F7 (LOW)  -  Dead field `templates: []` in `BOUND_DS.json`

`BOUND_DS.json:64` carries `templates: []`, populated by `detect-bound-ds.mjs` but read by no script
or skill. Either give it a consumer (template inventory) or stop populating it.

---

## Summary

| ID | Severity | File:line | One-line |
|----|----------|-----------|----------|
| F1 | HIGH | `synthesize-design-md.mjs:59-60` | `name`/`namespace` used without guard |
| F2 | HIGH | `extract-ds-tokens.mjs:44-48` | zero token CSS -> empty data, no warning |
| F3 | HIGH | `detect-bound-ds.mjs:27-32` | `readJson` swallows parse errors -> opaque crash |
| F4 | HIGH | `DESIGN.md:24-30` | anti-references corrupted (truncated/orphan punctuation) |
| F5 | MEDIUM | `ds-paths.mjs:7` vs `detect-bound-ds.mjs:52` | duplicate `isBuilderRoot`, opposite semantics |
| F6 | MEDIUM | `.github/workflows/ci.yml:55,72,78` | detectors non-blocking (intentional soft-rollout) |
| F7 | LOW | `BOUND_DS.json:64` | dead `templates: []` field |

**Not findings (verified clean):** atomic rollback in `file-snapshot.mjs`, distinct exit codes,
Builder/Consumer detection, em-dash hygiene in new public prose.

---

*Read-only reanalysis. Author applies fixes; this report edits nothing else.*
