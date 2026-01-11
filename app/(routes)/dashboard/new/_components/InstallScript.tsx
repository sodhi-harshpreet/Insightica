"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSearchParams } from "next/navigation"
import { Copy, Check } from "lucide-react"
import { useState } from "react"

export default function InstallScript() {
  const searchParams = useSearchParams()
  const websiteId = searchParams.get("websiteId")
  const domain = searchParams.get("domain")

  const [copied, setCopied] = useState(false)

  const script = `<script
  defer
  data-website-id="${websiteId}"
  data-domain="${domain}"
  src="http://localhost:3000/analytics.js">
</script>`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(script)
    setCopied(true)

    setTimeout(() => {
      setCopied(false)
    }, 1500)
  }

  return (
    <Card className="max-w-xl mx-auto">
      <CardHeader>
        <CardTitle>Install the WebTrack Script</CardTitle>
        <p className="text-sm text-muted-foreground">
          Copy and paste this into the <code>&lt;head&gt;</code> of your website
        </p>
      </CardHeader>

      <CardContent>
        <pre className="bg-black text-green-400 p-4 rounded-md text-sm relative">
          {script}

          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={handleCopy}
            className="absolute top-2 right-2 text-white hover:bg-gray-400"
            aria-label="Copy script"
          >
            {copied ? <Check size={16} /> : <Copy size={16} />}
          </Button>
        </pre>

        <Button className="w-full mt-4">
          Ok, I’ve installed the script
        </Button>
      </CardContent>
    </Card>
  )
}
