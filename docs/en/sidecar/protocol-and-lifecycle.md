# Protocol and lifecycle

```text
Host binds randomized current-user IPC
  → starts .nsc --nexa-sidecar --endpoint <endpoint>
  → sends 32-byte stdin challenge; peer echoes it over IPC
  → HELLO / WELCOME
  → REGISTER_BEGIN / ITEM* / END
  → STATE_SNAPSHOT_BEGIN / ITEM* / END
  → READY / ACTIVATE → ACTIVE
  → DEACTIVATE / UNREGISTER / UNREGISTERED / SHUTDOWN
```

Use SidecarBootstrap.ConnectAsync with Console.OpenStandardInput. Never put the proof in arguments, environment variables, logs or UI. WELCOME preserves the HELLO correlation and negotiates the supported feature intersection: BinaryPayloads=1, Streams=2, Health=4, Unregistration=8.

Use SidecarFrame/SidecarConnection and their codecs rather than inventing a fixed CLR struct ABI. Frames carry version, type, flags, correlation and payload length. Extensible codecs handle optional fields.

| Registration | Kind |
|---|---|
| Command / Query / State / Event | 1 / 2 / 3 / 4 |
| UiModule / Resource | 5 / 6 |
| UiPatch | 7 |
| EventCatch / EventListen | 8 / 9 |
| IntentCatch / IntentWait | 10 / 11 |
| FunctionPatch / Stream | 12 / 13 |

IDs are assigned per kind and session. Registration and snapshot admission commit completely or fail without a partial mirror. An empty state set still sends BEGIN(0)/END. Business work starts only after ACTIVATE; stop workers/streams on DEACTIVATE.

Manage pending work by correlation ID, cancel the matching operation on CANCEL, and reject late results after retirement. A reconnect re-verifies the executable and rebuilds registration, caches and IDs. Protocol/time-out failures are not successful empty results.

[Protocol](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/sidecar-protocol.md) · [Bootstrap/trust](https://github.com/Nexa-MC/NexaCL/blob/v2.0.0.alpha.12/docs/xsr/nsc-and-regional-policy.md).
