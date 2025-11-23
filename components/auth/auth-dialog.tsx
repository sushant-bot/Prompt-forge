"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Eye, EyeOff, Loader2, Mail, Lock, User } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"
import { useToast } from "@/hooks/use-toast"
import { SocialLogin } from "./social-login"

interface AuthDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AuthDialog({ open, onOpenChange }: AuthDialogProps) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [fullName, setFullName] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const { signIn, signUp, signInWithProvider } = useAuth()
  const { toast } = useToast()

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signIn(email, password)

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Welcome back!",
        description: "You've successfully signed in.",
      })
      onOpenChange(false)
      // Reset form
      setEmail("")
      setPassword("")
    }

    setIsLoading(false)
  }

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await signUp(email, password, fullName)

    if (error) {
      toast({
        title: "Sign Up Failed",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Account Created!",
        description: "Please check your email to verify your account.",
      })
      onOpenChange(false)
      // Reset form
      setEmail("")
      setPassword("")
      setFullName("")
    }

    setIsLoading(false)
  }

  const handleSocialLogin = async (provider: string) => {
    setIsLoading(true)

    const { error } = await signInWithProvider(provider.toLowerCase() as 'google' | 'github')

    if (error) {
      toast({
        title: "Sign In Failed",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
    }
    // Note: For OAuth, the page will redirect, so we don't need to handle success here
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] bg-black/90 backdrop-blur-xl border-white/20">
        <DialogHeader>
          <DialogTitle className="text-2xl text-white">Welcome to PromptForge</DialogTitle>
          <DialogDescription className="text-white/60">
            Sign in to sync your templates and history across devices
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="signin" className="w-full mt-4">
          <TabsList className="grid w-full grid-cols-2 bg-white/10">
            <TabsTrigger 
              value="signin"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              Sign In
            </TabsTrigger>
            <TabsTrigger 
              value="signup"
              className="data-[state=active]:bg-white/20 data-[state=active]:text-white text-white/70"
            >
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="signin" className="space-y-4 mt-4">
            <form onSubmit={handleSignIn} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signin-email" className="text-white/90">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="signin-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signin-password" className="text-white/90">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="signin-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/50 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <SocialLogin onSocialLogin={handleSocialLogin} type="signin" />
          </TabsContent>

          <TabsContent value="signup" className="space-y-4 mt-4">
            <form onSubmit={handleSignUp} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="signup-name" className="text-white/90">
                  Full Name
                </Label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="signup-name"
                    type="text"
                    placeholder="Enter your full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white/90">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="signup-email"
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white/90">
                  Password
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-white/50" />
                  <Input
                    id="signup-password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Create a password (min 6 characters)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                    required
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-white/50 hover:text-white/70"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <Button
                type="submit"
                className="w-full bg-linear-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating account...
                  </>
                ) : (
                  "Create Account"
                )}
              </Button>
            </form>

            <SocialLogin onSocialLogin={handleSocialLogin} type="signup" />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
