'use client';

import { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import { DefaultSearchDialog } from './default-search-dialog';
import { Input } from '../search/ui/input';
import { MxbaiLogoIcon } from '../search/ui/mxbai-logo-icon';

export function Header() {
  const [searchOpen, setSearchOpen] = useState(false);

  // Add Command+K keyboard shortcut
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === "k") {
        e.preventDefault();
        setSearchOpen(true);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <header className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <a href="https://mixedbread.ai" className="flex items-center gap-2">
            <MxbaiLogoIcon className="size-8" />
            <span className="sr-only">Mixedbread</span>
          </a>

          <div className="flex-1 max-w-xs ml-auto">
            <div
              className="relative cursor-pointer"
              onClick={() => setSearchOpen(true)}
            >
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search docs..."
                className="pl-9 pr-16 cursor-pointer"
                readOnly
              />
              <kbd className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                <span className="text-xs">⌘</span>K
              </kbd>
            </div>
          </div>
        </div>
      </header>
      
      <DefaultSearchDialog open={searchOpen} onOpenChange={setSearchOpen} />
    </>
  );
}