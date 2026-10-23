# Native packaging, discovery, trust, supervision

Deliver a verified capability to its intended Host with explicit installation prerequisites. This describes A12 native .nsc, not the independent SDK package format.

## Native .nsc

It is a renamed PE/ELF/thin Mach-O, without a custom encrypted container or in-memory loader. OS/architecture must match. Renaming managed DLLs/scripts/ZIPs does not create native programs.

```sh
dotnet publish examples/sidecar/Example.Sidecar.csproj -c Release -r linux-x64 -p:PublishAot=true -p:NexaCLSourceRoot=/absolute/path/to/NexaCL -o out/sidecar
mv out/sidecar/Example.Sidecar out/sidecar/example.nsc
chmod +x out/sidecar/example.nsc
out/sidecar/example.nsc --self-test
```

Publish on the target toolchain; Windows starts from .exe, macOS uses per-RID thin images. Validate final bytes before signing. Do not expect unadmitted files copied into a real installation to execute.

## Discovery and identity

Only top-level .nsc in AppContext.BaseDirectory is scanned, not arbitrary game folders. PackageName is basename without extension. Maximum 64 candidates; empty/ambiguous identities reject independently. Adjacent example.nsc.asc is required. Image bound 512 MiB, signature64 KiB. Format/signature checks precede OS execution; discovery is not activation.

## Signing versus trust

An authorized release identity can sign final bytes:

```sh
gpg --armor --detach-sign --local-user YOUR_AUTHORIZED_FINGERPRINT --output example.nsc.asc example.nsc
gpg --verify example.nsc.asc example.nsc
```

Verification proves the key signed those bytes, not that production Host trusts it. **A12 pins its embedded release key. A self-created key does not grant installation.** Follow the maintainers' actual review/distribution process; no self-service trust onboarding is promised here.

Without production signing, use self-tests/recipes/controlled fixtures, never weaken production verification. Keep private keys out of source/arguments/logs/packages. Publisher trust does not grant every extension target.

## Launch and one-use proof

```text
example.nsc --nexa-sidecar --endpoint <random-endpoint>
```

Host binds random current-user IPC before launch and supplies 32 random bytes through redirected stdin. Bootstrap.ConnectAsync echoes proof before HELLO. Never put proof in arguments/logs/UI.

Windows pipes are current-user only. Unix sockets use a generated0700 directory/0600 socket; use actual listener.Endpoint. A logical pipe name is not a deletion path.

## Supervision and cleanup

One failed session does not stop others. Supervisor records status/exits/recovery and quarantines after at most three recovery attempts. Stop disables recovery; Restart revalidates; Reload rescans the original root.

Await async shutdown when joined teardown matters. Process-tree termination is best effort and cannot guarantee orphan/detached descendants. The peer owns its workers/libraries/child processes.

## Distribution evidence

For each RID provide image/signature/version/architecture/features/targets/licenses/reproduction/limitations. Distinguish native execution from portable fixtures. NativeAOT is not a sandbox, signatures do not unlock all APIs, and process isolation is not arbitrary same-user file protection.


## Implementation references

- [docs/xsr/nsc-and-regional-policy.md](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md)
- [Nexa.Sidecar.Transport/SidecarExecutable.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Sidecar.Transport/SidecarExecutable.cs)
- [Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/Nexa.Xsr.Runtime/Sidecar/SidecarSupervisor.cs)
