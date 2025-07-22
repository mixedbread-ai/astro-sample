'use client';

import { ChevronRightIcon, FileTextIcon, LoaderCircleIcon, SearchIcon } from 'lucide-react';
import { cn } from '../../lib/utils';
import {
  type ComponentProps,
  Fragment,
  type ReactNode,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from 'react';
import { ScrollArea } from './scroll-area';
import type { SearchResult } from '../lib/types';

interface SearchContextProps {
  search: string;
  onSearchChange: (value: string) => void;
  results: SearchResult[];
  isLoading: boolean;
}

interface SearchListContextProps {
  active: string | null;
  setActive: (value: string | null) => void;
}

interface SearchListItemContextProps {
  item: SearchResult;
}

const SearchContext = createContext<SearchContextProps | null>(null);

const SearchListContext = createContext<SearchListContextProps | null>(null);

const SearchListItemContext = createContext<SearchListItemContextProps | null>(null);

export type SearchProps = PropsWithChildren<SearchContextProps>;

export function Search({
  search,
  onSearchChange,
  results,
  isLoading = false,
  children,
}: SearchProps) {
  const [active, setActive] = useState<string | null>(null);

  const memoizedValue = useMemo(
    () => ({
      search,
      onSearchChange,
      active,
      setActive,
      isLoading,
      results,
    }),
    [search, onSearchChange, active, setActive, isLoading, results],
  );

  return <SearchContext.Provider value={memoizedValue}>{children}</SearchContext.Provider>;
}

export type SearchInputProps = ComponentProps<'input'>;

export function SearchInput({ className, ...props }: SearchInputProps) {
  const { search, onSearchChange } = useSearchRuntime();

  return (
    <input
      placeholder="Search"
      aria-label="Search"
      autoComplete="off"
      autoCorrect="off"
      spellCheck="false"
      className={cn('w-0 flex-1 bg-transparent py-2 text-base placeholder:text-muted-foreground', className)}
      {...props}
      value={search}
      onChange={(e) => onSearchChange(e.target.value)}
    />
  );
}

export interface SearchListProps extends ComponentProps<typeof ScrollArea> {
  items: SearchResult[];
  Empty?: () => ReactNode;
  Item?: typeof SearchListItem;
}

export function SearchList({
  items,
  Empty = () => <div className="py-12 text-center text-sm text-muted-foreground">No results found</div>,
  Item = (props) => (
    <SearchListItem {...props}>
      <SearchListItemBreadcrumb />
      <SearchListItemTitle />
    </SearchListItem>
  ),
  className,
  children,
  ...props
}: SearchListProps) {
  const [active, setActive] = useState<string | null>(items.at(0)?.id ?? null);

  const onKey = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' || e.key === 'ArrowUp') {
        let idx = items.findIndex((item) => item.id === active);
        if (idx === -1) idx = 0;
        else if (e.key === 'ArrowDown') idx++;
        else idx--;

        setActive(items.at(idx % items.length)?.id ?? null);
        e.preventDefault();
      }

      if (e.key === 'Enter') {
        const selected = items.find((item) => item.id === active);

        if (selected) {
          // Trigger click on the active item element to respect any custom onClick
          const activeElement = document.querySelector(
            `[data-search-item-id="${selected.id}"]`,
          ) as HTMLButtonElement;
          if (activeElement) {
            activeElement.click();
          }
        }
        e.preventDefault();
      }
    },
    [items, active, setActive],
  );

  useEffect(() => {
    window.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('keydown', onKey);
    };
  }, [onKey]);

  useEffect(() => {
    if (items.length > 0) setActive(items[0]?.id ?? null);
  }, [items]);

  const memoizedValue = useMemo(
    () => ({
      active,
      setActive,
    }),
    [active],
  );

  return (
    <SearchIf hasResults>
      <ScrollArea className={cn('flex flex-col p-4', className)} {...props}>
        <div className="flex flex-col gap-3">
          <SearchListContext.Provider value={memoizedValue}>
            <SearchIf isEmpty>
              <Empty />
            </SearchIf>

            {children || items.map((item) => <Fragment key={item.id}>{Item({ item })}</Fragment>)}
          </SearchListContext.Provider>
        </div>
      </ScrollArea>
    </SearchIf>
  );
}

export interface SearchListItemProps extends ComponentProps<'button'> {
  item: SearchResult;
}

export function SearchListItem({ item, className, onClick, children, ...props }: SearchListItemProps) {
  const { active: activeId, setActive } = useSearchList();
  const active = item.id === activeId;

  const handleClick =
    onClick ||
    (() => {
      window.location.href = item.url;
    });

  return (
    <SearchListItemContext.Provider value={{ item }}>
      <button
        ref={useCallback(
          (element: HTMLButtonElement | null) => {
            if (active && element) {
              element.scrollIntoView({
                block: 'nearest',
              });
            }
          },
          [active],
        )}
        data-search-item-id={item.id}
        aria-current={active ? 'true' : undefined}
        className={cn(
          'flex min-h-10 w-full flex-col justify-center border border-border/60 gap-2.5 px-4 py-2 rounded-lg text-sm',
          className,
          active && 'bg-accent/50 text-accent-foreground',
        )}
        onPointerMove={() => setActive(item.id)}
        onClick={handleClick}
        {...props}
      >
        {children}
      </button>
    </SearchListItemContext.Provider>
  );
}

export function SearchListItemTitle() {
  const { item } = useSearchListItem();

  return (
    <div className="flex items-center gap-2">
      <FileTextIcon className="size-4 shrink-0 text-muted-foreground" />
      <span className="line-clamp-1 text-left">{item.title}</span>
    </div>
  );
}

export function SearchListItemBreadcrumb() {
  const { item } = useSearchListItem();

  return (
    <div className="flex items-center gap-1">
      {item.breadcrumb.map((breadcrumb, index) => (
        <Fragment key={breadcrumb}>
          <span className="text-xs text-muted-foreground">{breadcrumb}</span>
          {index !== item.breadcrumb.length - 1 && <ChevronRightIcon className="size-3 text-muted-foreground" />}
        </Fragment>
      ))}
    </div>
  );
}

type SearchIfFilters = {
  isLoading?: boolean;
  hasResults?: boolean;
  isEmpty?: boolean;
  hasQuery?: boolean;
};

type UseSearchIfProps = SearchIfFilters;

const useSearchIf = (props: UseSearchIfProps) => {
  const { search, results, isLoading } = useSearchRuntime();

  if (props.isLoading !== undefined && props.isLoading !== isLoading) return false;

  if (props.hasResults === true && results.length === 0) return false;
  if (props.hasResults === false && results.length > 0) return false;

  if (props.isEmpty === true && (search.length === 0 || results.length > 0)) return false;
  if (props.isEmpty === false && results.length === 0) return false;

  if (props.hasQuery === true && search.length === 0) return false;
  if (props.hasQuery === false && search.length > 0) return false;

  return true;
};

export type SearchIfProps = PropsWithChildren<UseSearchIfProps>;

export function SearchIf({ children, ...query }: SearchIfProps) {
  const result = useSearchIf(query);
  return result ? children : null;
}

export type SearchIndicatorIconProps = ComponentProps<'div'>;

export function SearchIndicatorIcon({ className, ...props }: SearchIndicatorIconProps) {
  return (
    <div className={cn('relative size-4', className)} {...props}>
      <SearchIf isLoading>
        <LoaderCircleIcon className="absolute size-full animate-spin text-primary transition-opacity" />
      </SearchIf>
      <SearchIf isLoading={false}>
        <SearchIcon className="absolute size-full text-muted-foreground transition-opacity" />
      </SearchIf>
    </div>
  );
}

export function useSearchRuntime() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error('useSearchRuntime must be used within a Search');
  return ctx;
}

export function useSearchList() {
  const ctx = useContext(SearchListContext);
  if (!ctx) throw new Error('useSearchList must be used within a SearchList');
  return ctx;
}

export function useSearchListItem() {
  const ctx = useContext(SearchListItemContext);
  if (!ctx) throw new Error('useSearchListItem must be used within a SearchListItem');
  return ctx;
}