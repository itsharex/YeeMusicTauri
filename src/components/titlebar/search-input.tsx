"use client";

import { Search24Regular } from "@fluentui/react-icons";
import { Input } from "../ui/input";
import { useEffect, useState } from "react";
import { getSearchDefault, getSearchSuggest } from "@/lib/services/search";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";
import { useNavigate } from "react-router-dom";

export function SearchInput() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 300);
  const [placeholder, setPlaceholder] = useState("搜索...");
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchDefault() {
      try {
        const res = await getSearchDefault();
        if (res?.showKeyword) setPlaceholder(res.showKeyword);
      } catch (err) {
        console.error("获取默认搜索词失败", err);
      }
    }
    fetchDefault();
  }, []);

  useEffect(() => {
    if (!debouncedQuery) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSuggestions([]);
      return;
    }

    async function fetchSuggest() {
      try {
        const res = await getSearchSuggest(debouncedQuery);
        setSuggestions(res);
      } catch (err) {
        console.error("获取搜索建议失败", err);
      }
    }
    fetchSuggest();
  }, [debouncedQuery]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSelectedIndex(-1);
  }, [suggestions]);

  function handleSearch(keyword: string) {
    if (!keyword.trim() && !placeholder.trim()) return;
    setQuery(keyword);
    setSuggestions([]);
    setIsOpen(false);
    navigate(
      `/search?q=${encodeURIComponent(keyword ? keyword : placeholder)}`,
    );
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0 && suggestions.length > 0)
        handleSearch(suggestions[selectedIndex]);
      else handleSearch(query);
      return;
    }

    if (!isOpen || suggestions.length === 0) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % suggestions.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        setSelectedIndex(
          (prev) => (prev - 1 + suggestions.length) % suggestions.length,
        );
        break;
      case "Escape":
        setIsOpen(false);
        break;
    }
  }

  return (
    <div className="relative">
      <Input
        placeholder={placeholder}
        className={cn(
          "w-72 bg-card/80 pr-8 rounded-md shadow-xs border-border/80 focus:border-border/80! focus:ring-0!",
          isOpen && suggestions.length > 0 && "rounded-b-none",
        )}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => setIsOpen(true)}
        onBlur={() => setTimeout(() => setIsOpen(false), 0)}
        onKeyDown={handleKeyDown}
      />

      <Search24Regular
        className="text-black/60 hover:text-black/80 size-4 cursor-pointer absolute right-2 top-1/2 -translate-y-1/2"
        onClick={() => handleSearch(query)}
      />

      <div
        className={cn(
          "absolute top-full left-0 bg-card w-full px-2 py-2 drop-shadow-sm rounded-b-md border-0 flex flex-col gap-2",
          isOpen && suggestions.length > 0
            ? "visible opacity-100 border-t-2 border-primary"
            : "invisible opacity-0",
        )}
      >
        {suggestions.map((suggest, index) => (
          <div
            key={suggest}
            className={cn(
              "hover:bg-black/5 w-full px-4 py-2 rounded-md cursor-pointer relative",
              index === selectedIndex && "bg-accent",
            )}
            onClick={() => {
              handleSearch(suggest);
            }}
          >
            <span className={cn("line-clamp-1 text-sm")}>{suggest}</span>
            {index === selectedIndex && (
              <div className="bg-primary w-1 h-4 absolute left-0 top-1/2 -translate-y-1/2 -translate-x-0.5 rounded-full"></div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
