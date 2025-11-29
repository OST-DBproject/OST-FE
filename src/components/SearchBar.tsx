import SearchIcon from "../assets/search.svg";

export default function SearchBar() {
    return (
        <div className="w-full bg-[#2A2C28] h-12 rounded-sm flex items-center px-4">
            <input
                placeholder="검색어를 입력하세요"
                className="flex-1 bg-transparent outline-none text-white"
            />
            <img
                src={SearchIcon}
                alt="검색"
                className="w-5 h-5 opacity-90"
            />
        </div>
    );
}
