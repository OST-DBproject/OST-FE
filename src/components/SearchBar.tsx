import SearchIcon from "../assets/search.svg";
import { useState } from "react";

type SearchBarProps = {
    onSearch: (query: string) => void;
};

export default function SearchBar({ onSearch }: SearchBarProps) {
    const [value, setValue] = useState("");

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            onSearch(value);
        }
    };

    return (
        <div className="w-full bg-background opacity-60 h-12 rounded-sm flex items-center px-4">
            <input
                placeholder="검색어를 입력하세요"
                className="flex-1 bg-transparent outline-none text-white"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                onKeyDown={handleKeyDown}
            />
            <img src={SearchIcon} alt="검색" className="w-5 h-5 opacity-90" />
        </div>
    );
}
