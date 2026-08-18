# Offline backup/restore contract

Daily Record backups are local JSON snapshots of the Room database. Backup format version 1.1 includes app settings as well as the existing user data collections.

Restore operations must be performed atomically in a Room transaction: either the complete snapshot is restored or the existing database remains unchanged.

Version 1.0 backups remain valid; their missing settings collection is treated as empty during restore.
