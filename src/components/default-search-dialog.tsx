'use client';

import { SearchIndicatorIcon, SearchInput, SearchList, Search } from '../search/ui/search';
import { MxbaiLogoIcon } from '../search/ui/mxbai-logo-icon';
import {
  SearchDialog,
  SearchDialogContent,
  SearchDialogFooter,
  SearchDialogHeader,
  SearchDialogOverlay,
} from '../search/ui/dialog';
import { motion } from 'motion/react';
import { useMeasure } from '../search/hooks/use-measure';
import { useSearch } from '../search/hooks/use-search';

export function DefaultSearchDialog(props: { open: boolean; onOpenChange: (open: boolean) => void }) {
  const { search, setSearch, results, isLoading } = useSearch();

  const [ref, dimensions] = useMeasure<HTMLDivElement>();

  return (
    <SearchDialog {...props}>
      <SearchDialogOverlay />

      <SearchDialogContent className="max-w-2xl">
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: dimensions.height, opacity: 1 }}
          className="overflow-clip"
        >
          <div ref={ref}>
            <Search
              search={search}
              onSearchChange={setSearch}
              results={results}
              isLoading={isLoading}
            >
              <SearchDialogHeader>
                <SearchIndicatorIcon />
                <SearchInput className="focus-visible:outline-none py-3" />
              </SearchDialogHeader>

              <SearchList items={results} className="max-h-[400px] border-t border-border/60" />
            </Search>

            <SearchDialogFooter className="justify-end flex">
              <p className="text-xs text-muted-foreground flex items-center gap-2">
                Powered by{' '}
                <a
                  href="https://mixedbread.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1"
                >
                  <MxbaiLogoIcon className="size-4" />
                  <span className="text-logo">Mixedbread</span>
                </a>
              </p>
            </SearchDialogFooter>
          </div>
        </motion.div>
      </SearchDialogContent>
    </SearchDialog>
  );
}