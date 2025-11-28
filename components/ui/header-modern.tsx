'use client';
import React from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { MenuToggleIcon } from '@/components/ui/menu-toggle-icon';
import { useScroll } from '@/components/ui/use-scroll';
import { 
  Moon, Sun, Copy, Sparkles, LogIn, LogOut, History
} from 'lucide-react';

interface ModernHeaderProps {
  darkMode: boolean;
  toggleDarkMode: () => void;
  user: any;
  loading: boolean;
  signOut: () => void;
  setIsAuthDialogOpen: (open: boolean) => void;
  copyPrompt: () => void;
  generatedPrompt: string;
  mounted: boolean;
  selectedModel: string;
  setSelectedModel: (model: string) => void;
}

const AI_MODELS = [
  { value: "gpt-4", label: "GPT-4", icon: "🤖" },
  { value: "gpt-3.5", label: "GPT-3.5", icon: "🤖" },
  { value: "claude-3", label: "Claude 3", icon: "🧠" },
  { value: "gemini", label: "Gemini Pro", icon: "✨" },
  { value: "copilot", label: "GitHub Copilot", icon: "💻" },
  { value: "custom", label: "Custom", icon: "⚙️" },
];

export function ModernHeader({
  darkMode,
  toggleDarkMode,
  user,
  loading,
  signOut,
  setIsAuthDialogOpen,
  copyPrompt,
  generatedPrompt,
  mounted,
  selectedModel,
  setSelectedModel,
}: ModernHeaderProps) {
  const [open, setOpen] = React.useState(false);
  const scrolled = useScroll(10);

  const quickActions = [
    {
      label: 'Copy',
      icon: Copy,
      onClick: () => {
        copyPrompt();
        setOpen(false);
      },
      variant: 'ghost' as const,
      disabled: !generatedPrompt,
    },
  ];

  React.useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <header
      className={cn(
        'sticky top-0 z-50 mx-auto w-full transition-all duration-300 ease-out',
        scrolled || open
          ? 'bg-white/80 dark:bg-black/70 backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-lg'
          : 'bg-white/60 dark:bg-black/40 backdrop-blur-xl border-b border-transparent',
      )}
      role="banner"
    >
      <nav
        className={cn(
          'container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 transition-all ease-out',
          {
            'h-14': scrolled,
          },
        )}
      >
        {/* Logo & Brand */}
        <div className="flex items-center gap-3 sm:gap-4">
          <div 
            className={cn(
              "rounded-2xl bg-linear-to-br from-orange-500 via-pink-500 to-purple-500 flex items-center justify-center shadow-lg transition-all",
              scrolled ? "h-9 w-9" : "h-10 w-10 sm:h-12 sm:w-12"
            )}
            role="img"
            aria-label="PromptForge logo"
          >
            <Sparkles className={cn("text-white transition-all", scrolled ? "h-4 w-4" : "h-5 w-5 sm:h-6 sm:w-6")} aria-hidden="true" />
          </div>
          <div className="flex flex-col">
            <h1 className={cn(
              "font-bold bg-linear-to-r from-orange-600 via-pink-600 to-purple-600 bg-clip-text text-transparent tracking-tight transition-all",
              scrolled ? "text-lg sm:text-xl" : "text-lg sm:text-2xl"
            )}>
              PromptForge
            </h1>
            {!scrolled && (
              <p className="text-[10px] sm:text-xs text-slate-600 dark:text-slate-300 font-medium hidden sm:block">
                Craft AI Prompts with Precision ✨
              </p>
            )}
          </div>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center gap-2">
          {/* Model Selector */}
          <Select value={selectedModel} onValueChange={setSelectedModel}>
            <SelectTrigger 
              className="w-40 h-9 rounded-full bg-white/50 dark:bg-black/30 border-white/20 hover:bg-white/70 dark:hover:bg-black/50"
              aria-label="Select AI model"
            >
              <SelectValue placeholder="Select Model" />
            </SelectTrigger>
            <SelectContent>
              {AI_MODELS.map((model) => (
                <SelectItem key={model.value} value={model.value}>
                  <span className="flex items-center gap-2">
                    <span>{model.icon}</span>
                    <span>{model.label}</span>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Quick Actions */}
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <Button
                key={action.label}
                variant={action.variant}
                onClick={action.onClick}
                disabled={action.disabled}
                className="rounded-full h-9 px-3 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2 disabled:opacity-50"
                aria-label={action.label}
              >
                <Icon className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">{action.label}</span>
              </Button>
            );
          })}

          {/* Auth Button */}
          {mounted && user ? (
            <Button
              variant="ghost"
              onClick={() => signOut()}
              className="rounded-full h-9 px-3 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md gap-2"
              aria-label={`Sign out ${user.email}`}
            >
              <span className="text-sm font-medium max-w-[100px] truncate">
                {user.email?.split('@')[0]}
              </span>
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </Button>
          ) : (
            mounted && !loading && (
              <Button
                variant="ghost"
                onClick={() => setIsAuthDialogOpen(true)}
                className="rounded-full h-9 px-3 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white border-none backdrop-blur-md gap-2 shadow-lg"
                aria-label="Sign in to your account"
              >
                <LogIn className="h-4 w-4" aria-hidden="true" />
                <span className="text-sm font-medium">Sign In</span>
              </Button>
            )
          )}

          {/* Theme Toggle */}
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="rounded-full h-9 w-9 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
            )}
          </Button>
        </div>

        {/* Mobile Actions */}
        <div className="flex lg:hidden items-center gap-2">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleDarkMode} 
            className="rounded-full h-9 w-9 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20 backdrop-blur-md"
            aria-label={darkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {darkMode ? (
              <Sun className="h-4 w-4 text-yellow-400" aria-hidden="true" />
            ) : (
              <Moon className="h-4 w-4 text-slate-700" aria-hidden="true" />
            )}
          </Button>

          <Button
            size="icon"
            variant="outline"
            onClick={() => setOpen(!open)}
            className="rounded-full h-9 w-9 bg-white/50 dark:bg-black/30 hover:bg-white/70 dark:hover:bg-black/50 border border-white/20"
            aria-label={open ? "Close menu" : "Open menu"}
          >
            <MenuToggleIcon open={open} className="h-5 w-5" duration={300} />
          </Button>
        </div>
      </nav>

      {/* Mobile Menu */}
      <div
        className={cn(
          'bg-white/80 dark:bg-black/80 backdrop-blur-xl fixed top-16 right-0 bottom-0 left-0 z-50 flex flex-col overflow-hidden border-t border-white/20 dark:border-white/10 lg:hidden',
          open ? 'block' : 'hidden',
        )}
      >
        <div
          data-slot={open ? 'open' : 'closed'}
          className={cn(
            'data-[slot=open]:animate-in data-[slot=open]:zoom-in-95 data-[slot=closed]:animate-out data-[slot=closed]:zoom-out-95 ease-out',
            'flex h-full w-full flex-col justify-between gap-y-4 p-4',
          )}
        >
          <div className="space-y-4">
            {/* Model Selector */}
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="mobile-model-select">
                AI Model
              </label>
              <Select value={selectedModel} onValueChange={setSelectedModel}>
                <SelectTrigger id="mobile-model-select" className="w-full">
                  <SelectValue placeholder="Select Model" />
                </SelectTrigger>
                <SelectContent>
                  {AI_MODELS.map((model) => (
                    <SelectItem key={model.value} value={model.value}>
                      <span className="flex items-center gap-2">
                        <span>{model.icon}</span>
                        <span>{model.label}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2">
              <h3 className="text-sm font-medium">Quick Actions</h3>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Button
                    key={action.label}
                    variant="outline"
                    className="w-full justify-start gap-2"
                    onClick={action.onClick}
                    disabled={action.disabled}
                  >
                    <Icon className="h-4 w-4" aria-hidden="true" />
                    <span>{action.label}</span>
                  </Button>
                );
              })}
            </div>
          </div>

          {/* Auth Section */}
          <div className="space-y-2">
            {mounted && user ? (
              <>
                <div className="text-sm text-muted-foreground mb-2 px-2">
                  Signed in as <span className="font-medium">{user.email}</span>
                </div>
                <Button
                  variant="outline"
                  className="w-full justify-start gap-2"
                  onClick={() => {
                    signOut();
                    setOpen(false);
                  }}
                >
                  <LogOut className="h-4 w-4" aria-hidden="true" />
                  <span>Sign Out</span>
                </Button>
              </>
            ) : (
              mounted && !loading && (
                <Button
                  className="w-full justify-start gap-2 bg-linear-to-r from-orange-500 to-pink-500 hover:from-orange-600 hover:to-pink-600 text-white"
                  onClick={() => {
                    setIsAuthDialogOpen(true);
                    setOpen(false);
                  }}
                >
                  <LogIn className="h-4 w-4" aria-hidden="true" />
                  <span>Sign In</span>
                </Button>
              )
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
