# Read package assets and authorized user files

Choose the file route according to ownership. A package asset has already been
hashed into the plugin manifest. A user file needs a Host-issued grant. Neither a
string containing a path nor a FileRef displayed by another plugin grants access.

## Open a package asset

Include the asset in the package payload list and rebuild its digest after edits.
Call `Files.OpenPackageFile` with the exact normalized relative path. Use the
returned FileRef in operations that accept that asset, such as UI.RegisterPage.
The first tutorial demonstrates `page.nxml` through this route.

Avoid an enclosing directory in the ZIP: `page.nxml` and `my-plugin/page.nxml` are
different paths. Case and path normalization must match the admitted manifest.
Do not add symlinks or traversal paths to the archive.

## Request a user file

Use the documented picker/grant operation and respect cancellation. Access only
the granted file or directory scope. Do not turn a selected file into authority to
read its parent, siblings or a resolved symlink target outside the grant.
Host filesystem policy remains authoritative on each operation.

Read bounded ranges and track returned lengths. A short read, end of file and a
failed read are different states. For replacement writes use the provided atomic
write operation and its revision/plan requirements rather than writing partial data
into a live file. File watching can overflow; re-stat or re-read after a reported gap.

## Handle blobs and lifetimes

A BlobRef identifies Host-retained bytes in the current ownership scope. It is not
base64 content and cannot be persisted as a portable reference across restarts.
Only use the release operation documented for that resource type; the current API
does not imply one universal release method for every blob-bearing result.
Avoid accumulating large results indefinitely.

Test picker cancellation, an asset hash mismatch, permission revocation and a file
changed between read and write. Keep file contents and private paths out of routine
logs. See [Files](../api/files.md) and [Platform](../api/platform.md) for exact contracts.

---

Source: [NexaCL-Plugin-SDK](https://github.com/Nexa-MC/NexaCL-Plugin-SDK/blob/cd93011b3a34b230415d4a7f6d585e646074b78a/docs/how-to/files.md) · Apache-2.0.
