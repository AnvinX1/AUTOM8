"use client"

import { useState } from "react"
import { useStore } from "@/lib/store"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AnimateIn } from "@/components/ui/animate-in"
import { SlidersHorizontal, RefreshCcw } from "lucide-react"

export default function SettingsPage() {
  const { settings, updateSettings } = useStore()
  const [formData, setFormData] = useState(settings)
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    updateSettings(formData)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 relative">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 h-56 w-[36rem] -translate-x-1/2 rounded-full bg-gradient-to-b from-cyan-500/10 to-transparent blur-3xl" />
      </div>

      <AnimateIn>
        <div>
          <h1 className="text-3xl font-bold">Settings</h1>
          <p className="text-muted-foreground mt-2">Configure global settings for attainment calculations</p>
        </div>
      </AnimateIn>

      <AnimateIn>
        <Card className="bg-card/70 backdrop-blur border-border/60">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Attainment Configuration</CardTitle>
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-b from-cyan-500/20 to-transparent text-cyan-500">
                <SlidersHorizontal size={16} />
              </span>
            </div>
            <CardDescription>Set default targets and weightages for all courses</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
          <div>
            <Label htmlFor="target">Default Target Attainment (%)</Label>
            <Input
              id="target"
              type="number"
              min="0"
              max="100"
              value={formData.targetPercentage}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  targetPercentage: Number.parseInt(e.target.value) || 0,
                })
              }
              className="mt-2"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Default target percentage for course outcome attainment
            </p>
          </div>

          <div className="border-t border-border pt-6">
            <h3 className="font-semibold mb-4">Assessment Weightages</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="cie">CIE Weightage (%)</Label>
                <Input
                  id="cie"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.cieWeightage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      cieWeightage: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Continuous Internal Evaluation weightage</p>
              </div>

              <div>
                <Label htmlFor="see">SEE Weightage (%)</Label>
                <Input
                  id="see"
                  type="number"
                  min="0"
                  max="100"
                  value={formData.seeWeightage}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      seeWeightage: Number.parseInt(e.target.value) || 0,
                    })
                  }
                  className="mt-2"
                />
                <p className="text-xs text-muted-foreground mt-1">Semester End Examination weightage</p>
              </div>

              <div className="bg-muted/50 p-3 rounded-lg">
                <p className="text-sm">
                  Total Weightage:{" "}
                  <span className="font-semibold">{formData.cieWeightage + formData.seeWeightage}%</span>
                </p>
              </div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSave} className="bg-cyan-500 hover:bg-cyan-600">
              Save Settings
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => setFormData({ targetPercentage: 70, cieWeightage: 40, seeWeightage: 60 })}
              className="gap-2"
            >
              <RefreshCcw size={16}/> Reset Defaults
            </Button>
            {saved && (
              <span className="text-green-600 dark:text-green-400 text-sm flex items-center">✓ Settings saved</span>
            )}
          </div>
          </CardContent>
        </Card>
      </AnimateIn>

      <AnimateIn>
        <Card className="bg-card/70 backdrop-blur border-border/60">
          <CardHeader>
            <CardTitle>About Autom8</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm">
          <p>
            <span className="font-semibold">Autom8 by AI08</span> is a modern dashboard for automating Course Outcome
            (CO) Attainment tracking.
          </p>
          <p>All data is stored locally in your browser using localStorage. No data is sent to any server.</p>
          <p className="text-muted-foreground">Version 1.0.0</p>
          </CardContent>
        </Card>
      </AnimateIn>
    </div>
  )
}
