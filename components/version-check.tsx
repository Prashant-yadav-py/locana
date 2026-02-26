"use client"

import { useVersionCheck } from '@/hooks/use-version-check'

export function VersionCheck() {
  useVersionCheck()
  return null
}
