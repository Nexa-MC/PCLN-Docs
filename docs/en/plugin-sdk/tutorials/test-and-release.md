# Test, package and publish a plugin

Start with a plugin that works in a compatible development launcher. A release
needs evidence about its bytes, contracts and behavior; a ZIP that opens successfully
only establishes the container layer.

## Build from clean inputs

In the template repository run:

```sh
python eng/build.py --clang clang
python eng/verify_package.py
```

Keep `plugin.config.json`, source assets and `sdk.lock.json` under version control.
Record the compiler version. Build twice from identical inputs and compare package
SHA-256 values if you require byte-for-byte reproducibility. Do not assume different
compiler versions emit identical Wasm.

The GitHub workflow compiles the real guest and the optional managed contract
example, verifies the ZIP and uploads the artifact. It does not automatically issue
a Market entitlement or approve a publisher identity.

## Test the Host behavior

| Test | Required observation |
| --- | --- |
| First load | Required capabilities negotiated; page appears only after activation |
| Permission denial | Feature fails explicitly; no alternative path bypasses the denial |
| Declined action | Callback does not run |
| Repeated request | A mutation key retains its original input identity |
| Cancellation | Pending work stops or reports its actual terminal/unknown outcome |
| Stop and reload | Old registrations disappear; new load uses new handles |
| Optional capability absent | Core feature still loads; unavailable UI explains the limitation |
| Offline restart | Previously admitted local content works within Host policy |
| Corrupt asset | Admission fails before executing unverified bytes |

Use a separate test profile and disposable data for mutation tests. The SDK tests
exercise encoding and facade behavior. PluginSidecar tests exercise the runtime.
NexaCL tests exercise actual application owners; none replaces all the others.

## Prepare release notes

State the plugin version, minimum tested Host build, SDK version, required contracts
and requested permissions. Describe visible changes and migration requirements.
Attach the verified package and its digest. Preserve previous immutable release
artifacts so a user can identify exactly what was installed.

A digest establishes byte identity. Publisher trust, encrypted delivery, entitlement
and revocation are Host/Market responsibilities. Do not advertise a local unsigned
ZIP as a production-approved Market package. See [packaging](../packaging.md).

## Upgrade deliberately

Update `sdk.lock.json` from the new immutable release, review its source identity
and digest, and update the managed PackageReference if you use that example. Rebuild
and repeat the affected Host tests. A new SDK method may still be unavailable in
the user's launcher; check [Host support](../host-support.md) before requiring it.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/3ad1c7f30d1b6d7d12b7699c38907cfc680b500e/docs/tutorials/test-and-release.md) · Apache-2.0.
