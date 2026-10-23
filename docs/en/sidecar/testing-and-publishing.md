# Testing and distribution

The example self-test uses real two-process IPC, but is not production signature admission or cross-platform physical acceptance. Cover invalid proofs, version mismatch, duplicate registrations, incorrect codecs, snapshot coverage, pre-READY requests, correlated cancellation, late replies, reconnect, bounded events/stream credits, stale UI intents and ordered shutdown.

```sh
# In the NexaCL source checkout:
dotnet run --project tests/Nexa.Sidecar.Tests -c Release
dotnet run --project tests/Nexa.Xsr.Runtime.Tests -c Release
```

Default registration limits are 4096 items, 256-character semantic IDs and 32 MiB aggregate payload. The initial state snapshot has its own 32 MiB budget, with 30-second phase deadlines. Hosts may lower limits. Values, pending exchanges, queues and streams have additional independent bounds.

Publish a native executable per RID, rename it `.nsc`, retain Unix execute permissions, and provide its adjacent `.nsc.asc` from a publisher actually trusted by the production Host. Never distribute a publisher private key. Alpha 12 discovers packages only at the top level of AppContext.BaseDirectory; identity is the basename without `.nsc`, not an arbitrary filesystem path.

Check real Host discovery, signature admission, bootstrap, activation, deactivation and restart before distribution. Document version, protocol requirements, platform/architecture and licensing. Common failure causes are wrong architecture/path/permission, missing or untrusted signatures, malformed 32-byte bootstrap handling, invalid counts/codecs/hashes, missing UI grants, and incorrect correlation/timeout/cancellation ownership.

A Sidecar crash must not terminate the Host. Do not swallow protocol failures and forge a successful result.
