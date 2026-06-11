import type { CategoryId, Locale } from "@/lib/types";

const en = {
  nav: {
    rankings: "Rankings",
    categories: "Categories",
    profile: "My votes",
    settings: "Settings",
    signOut: "Sign out",
    signIn: "Sign in",
  },
  home: {
    eyebrow: "THE COMMUNITY DECIDES",
    titleTop: "Vote for the best of",
    titleAccent: "VALORANT",
    description:
      "Vote for the skins, agents, collectibles, and players that define the game. Every vote reshapes the leaderboard.",
    explore: "Explore rankings",
    liveBoard: "View live board",
    pulse: "Community pulse",
    votesCast: "Votes cast",
    rankedItems: "Ranked items",
    voters: "Voters",
    trending: "Trending now",
    trendingDescription: "The community's current top picks across VALORANT.",
    fullRankings: "Full rankings",
    browse: "Choose your arena",
    browseDescription:
      "Seven categories. One community leaderboard. Pick a category and make your vote count.",
    topPick: "Top pick",
  },
  rankings: {
    title: "Community rankings",
    description:
      "Explore every category and help shape the definitive VALORANT fan leaderboard.",
    allCategories: "All categories",
    searchPlaceholder: "Search rankings...",
    sortVotes: "Most voted",
    sortName: "Name",
    sortNewest: "Recently added",
    allFilters: "All",
    results: "ranked items",
    updated: "Last updated",
    emptyTitle: "No contenders found",
    emptyDescription: "Try another search or clear the active filter.",
    clearFilters: "Clear filters",
  },
  item: {
    overview: "Overview",
    currentRank: "Current rank",
    inCategory: "in this category",
    communityVotes: "Community votes",
    related: "More from this category",
    share: "Share",
    linkCopied: "Link copied",
    source: "Data source",
  },
  vote: {
    action: "Vote",
    voted: "Voted",
    remove: "Remove vote",
    failed: "Your vote could not be saved. Please try again.",
    configurationMissing:
      "Voting is available after the Supabase environment variables are configured.",
  },
  auth: {
    title: "Join the ranking",
    description:
      "Sign in to vote, revisit your picks, and help define the community leaderboard.",
    google: "Continue with Google",
    privacy: "We only use your public profile to keep votes fair.",
    unavailable: "Google login is available after Supabase is configured.",
  },
  profile: {
    title: "My votes",
    description: "The contenders you have backed across every leaderboard.",
    signedOutTitle: "Sign in to see your votes",
    signedOutDescription:
      "Your voting history is saved securely to your VALOVOTE profile.",
    emptyTitle: "No votes yet",
    emptyDescription: "Explore the rankings and back your first contender.",
  },
  settings: {
    title: "Settings",
    description: "Choose how VALOVOTE looks and speaks to you.",
    language: "Language",
    languageDescription:
      "Your choice is saved on this device and to your profile when signed in.",
    english: "English",
    korean: "한국어",
    appearance: "Appearance",
    dark: "Dark mode",
    appearanceDescription: "VALOVOTE is designed around its dark esports theme.",
  },
  footer: {
    line: "Unofficial fan-made VALORANT ranking site.",
    disclaimer:
      "VALOVOTE is not endorsed by Riot Games and does not reflect the views or opinions of Riot Games.",
    data: "Game assets provided by Valorant-API.",
  },
  common: {
    loading: "Loading rankings",
    errorTitle: "Something went wrong",
    errorDescription: "The leaderboard could not be loaded.",
    retry: "Try again",
    close: "Close",
    menu: "Open menu",
    imageFallback: "Image unavailable",
    back: "Back",
    notAvailable: "Not available",
  },
  categories: {
    skins: {
      name: "Weapon skins",
      short: "Skins",
      description:
        "Premium finishes, iconic animations, and the sound designs worth equipping.",
      filterLabel: "Weapon",
    },
    agents: {
      name: "Agents",
      short: "Agents",
      description:
        "Rank the agents that make the biggest impact in your matches.",
      filterLabel: "Role",
    },
    sprays: {
      name: "Sprays",
      short: "Sprays",
      description:
        "The funniest, sharpest, and most recognizable sprays in the collection.",
      filterLabel: "Edition",
    },
    buddies: {
      name: "Gun buddies",
      short: "Buddies",
      description:
        "Rank the charms that add personality to every weapon loadout.",
      filterLabel: "Collection",
    },
    flex: {
      name: "Flex items",
      short: "Flex",
      description:
        "Rank the handheld flex cosmetics made for showing off in a match.",
      filterLabel: "Collection",
    },
    playercards: {
      name: "Player cards",
      short: "Cards",
      description:
        "Rank the artwork that gives every VALORANT profile its identity.",
      filterLabel: "Collection",
    },
    players: {
      name: "Pro players",
      short: "Players",
      description:
        "The stars, champions, and clutch performers defining competitive VALORANT.",
      filterLabel: "Region / team",
    },
  } satisfies Record<
    CategoryId,
    {
      name: string;
      short: string;
      description: string;
      filterLabel: string;
    }
  >,
};

const ko: typeof en = {
  nav: {
    rankings: "랭킹",
    categories: "카테고리",
    profile: "내 투표",
    settings: "설정",
    signOut: "로그아웃",
    signIn: "로그인",
  },
  home: {
    eyebrow: "커뮤니티가 결정합니다",
    titleTop: "발로란트 최고의 콘텐츠를",
    titleAccent: "투표로 정해보세요",
    description:
      "게임을 대표하는 스킨, 요원, 수집품과 선수를 직접 선택하세요. 모든 투표가 실시간 랭킹을 바꿉니다.",
    explore: "랭킹 둘러보기",
    liveBoard: "실시간 랭킹 보기",
    pulse: "커뮤니티 현황",
    votesCast: "누적 투표",
    rankedItems: "등록 아이템",
    voters: "참여 유저",
    trending: "지금 인기 순위",
    trendingDescription: "발로란트 전체 카테고리에서 가장 주목받는 콘텐츠입니다.",
    fullRankings: "전체 랭킹",
    browse: "카테고리를 선택하세요",
    browseDescription:
      "일곱 개 카테고리, 하나의 커뮤니티 랭킹. 좋아하는 콘텐츠에 한 표를 더하세요.",
    topPick: "현재 1위",
  },
  rankings: {
    title: "커뮤니티 랭킹",
    description:
      "모든 카테고리를 둘러보고 발로란트 팬 랭킹을 직접 만들어보세요.",
    allCategories: "전체 카테고리",
    searchPlaceholder: "랭킹 검색...",
    sortVotes: "추천순",
    sortName: "이름순",
    sortNewest: "최근 추가순",
    allFilters: "전체",
    results: "개 아이템",
    updated: "마지막 업데이트",
    emptyTitle: "검색 결과가 없습니다",
    emptyDescription: "다른 검색어를 입력하거나 필터를 초기화해보세요.",
    clearFilters: "필터 초기화",
  },
  item: {
    overview: "상세 정보",
    currentRank: "현재 순위",
    inCategory: "카테고리 기준",
    communityVotes: "커뮤니티 추천",
    related: "같은 카테고리의 다른 콘텐츠",
    share: "공유",
    linkCopied: "링크를 복사했습니다",
    source: "데이터 출처",
  },
  vote: {
    action: "추천",
    voted: "추천함",
    remove: "추천 취소",
    failed: "추천을 저장하지 못했습니다. 다시 시도해주세요.",
    configurationMissing:
      "Supabase 환경변수를 설정하면 실제 추천 기능을 사용할 수 있습니다.",
  },
  auth: {
    title: "랭킹에 참여하세요",
    description:
      "로그인하고 좋아하는 콘텐츠에 투표해 커뮤니티 랭킹을 함께 만들어보세요.",
    google: "Google로 계속하기",
    privacy: "공정한 투표 관리를 위해 공개 프로필 정보만 사용합니다.",
    unavailable: "Supabase 설정 후 Google 로그인을 사용할 수 있습니다.",
  },
  profile: {
    title: "내 투표",
    description: "내가 추천한 콘텐츠를 카테고리별로 확인할 수 있습니다.",
    signedOutTitle: "로그인 후 투표 기록을 확인하세요",
    signedOutDescription: "투표 기록은 VALOVOTE 프로필에 안전하게 저장됩니다.",
    emptyTitle: "아직 투표한 콘텐츠가 없습니다",
    emptyDescription: "랭킹을 둘러보고 첫 번째 콘텐츠를 추천해보세요.",
  },
  settings: {
    title: "설정",
    description: "VALOVOTE의 언어와 화면 설정을 변경합니다.",
    language: "언어",
    languageDescription:
      "선택한 언어는 이 기기와 로그인한 프로필에 저장됩니다.",
    english: "English",
    korean: "한국어",
    appearance: "화면",
    dark: "다크 모드",
    appearanceDescription: "VALOVOTE는 e스포츠 감성의 다크 테마로 제작되었습니다.",
  },
  footer: {
    line: "비공식 팬 제작 VALORANT 랭킹 사이트입니다.",
    disclaimer:
      "VALOVOTE는 Riot Games의 공식 서비스가 아니며 Riot Games의 견해나 의견을 대변하지 않습니다.",
    data: "게임 에셋은 Valorant-API에서 제공됩니다.",
  },
  common: {
    loading: "랭킹 불러오는 중",
    errorTitle: "문제가 발생했습니다",
    errorDescription: "랭킹을 불러오지 못했습니다.",
    retry: "다시 시도",
    close: "닫기",
    menu: "메뉴 열기",
    imageFallback: "이미지를 표시할 수 없습니다",
    back: "뒤로",
    notAvailable: "정보 없음",
  },
  categories: {
    skins: {
      name: "무기 스킨",
      short: "스킨",
      description: "완성도 높은 외형, 애니메이션과 사운드를 갖춘 최고의 스킨.",
      filterLabel: "무기",
    },
    agents: {
      name: "요원 선호도",
      short: "요원",
      description: "매치의 흐름을 바꾸고 가장 큰 영향력을 발휘하는 요원.",
      filterLabel: "역할",
    },
    sprays: {
      name: "스프레이",
      short: "스프레이",
      description: "재미와 개성이 살아있는 가장 인상적인 스프레이.",
      filterLabel: "에디션",
    },
    buddies: {
      name: "총기 장식",
      short: "총기 장식",
      description: "무기 장비에 개성을 더하는 최고의 총기 장식을 선택하세요.",
      filterLabel: "컬렉션",
    },
    flex: {
      name: "플렉스 아이템",
      short: "플렉스",
      description: "게임 안에서 직접 꺼내 자랑할 수 있는 플렉스 아이템.",
      filterLabel: "컬렉션",
    },
    playercards: {
      name: "플레이어 카드",
      short: "플레이어 카드",
      description: "VALORANT 프로필의 개성을 완성하는 최고의 카드 아트.",
      filterLabel: "컬렉션",
    },
    players: {
      name: "발로란트 선수",
      short: "선수",
      description: "경쟁전의 역사를 만들고 있는 스타, 챔피언, 클러치 플레이어.",
      filterLabel: "지역 / 팀",
    },
  },
};

export const dictionaries = { en, ko };
export type Dictionary = typeof en;

export function getDictionary(locale: Locale) {
  return dictionaries[locale];
}
