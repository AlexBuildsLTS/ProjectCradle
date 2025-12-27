import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

Deno.serve(async (req) => {
  // 1. Handshake: Solve the OPTIONS preflight issue
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const rawKey = Deno.env.get('ENCRYPTION_KEY')
    if (!rawKey) throw new Error('VAULT_FAILURE: ENCRYPTION_KEY_NOT_FOUND')

    const encoder = new TextEncoder()
    const keyData = encoder.encode(rawKey.padEnd(32, '0').slice(0, 32))
    
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-CBC" },
      false,
      ["decrypt"]
    )

    const { encryptedData, iv } = await req.json()
    const encryptedBuffer = Uint8Array.from(atob(encryptedData), c => c.charCodeAt(0))
    const ivBuffer = Uint8Array.from(atob(iv), c => c.charCodeAt(0))

    const decryptedBuffer = await crypto.subtle.decrypt(
      { name: "AES-CBC", iv: ivBuffer },
      cryptoKey,
      encryptedBuffer
    )

    const result = new TextDecoder().decode(decryptedBuffer)
    console.log("[Core] Link Established. Data decrypted successfully.")

    return new Response(JSON.stringify({ status: 'SUCCESS', result }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200
    })

  } catch (error: unknown) {
    // FIX: TYPE NARROWING
    // We check if 'error' is an actual Error object to satisfy the Deno-TS compiler.
    const errorMessage = error instanceof Error ? error.message : "An unexpected core failure occurred";
    
    console.error("[Decryption Error]", errorMessage)
    
    return new Response(JSON.stringify({ error: errorMessage }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400
    })
  }
})