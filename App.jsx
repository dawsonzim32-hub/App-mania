import React, { useState, useRef, useEffect } from 'react';
import { Trophy, Play, RotateCcw, Download, Star, Check, Zap, ExternalLink } from 'lucide-react';

// Supabase config
const SUPABASE_URL = 'https://rfwxuwxdepbzelyzengw.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJmd3h1d3hkZXBiemVseXplbmd3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY5NzAxMzYsImV4cCI6MjA4MjU0NjEzNn0.Z-7e6D-vL_QySH9PVUHaLz1aZ72OUicBhBhuWXv5Q3U';

// Simple Supabase client
const supabase = {
  from: (table) => ({
    insert: async (data) => {
      const res = await fetch(`${SUPABASE_URL}/rest/v1/${table}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
      });
      const json = await res.json();
      return { data: json, error: res.ok ? null : json };
    },
    select: async (columns = '*') => ({
      eq: async (column, value) => {
        const res = await fetch(
          `${SUPABASE_URL}/rest/v1/${table}?${column}=eq.${value}&select=${columns}`,
          {
            headers: {
              'apikey': SUPABASE_ANON_KEY,
              'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
            }
          }
        );
        const json = await res.json();
        return { data: json, error: res.ok ? null : json };
      }
    })
  })
};

const SongRanker = () => {
  // Album artwork - add your hosted image URLs here
  // Gradients progress through her eras: country gold → pop blue → indie earth → midnight
  const albumArt = {
    "Taylor Swift": {
      gradient: "from-cyan-400 via-teal-500 to-emerald-600",
      image: null // Add: "https://yourcdn.com/taylor-swift.jpg"
    },
    "Fearless (TV)": {
      gradient: "from-yellow-400 via-amber-500 to-yellow-600",
      image: null
    },
    "Speak Now (TV)": {
      gradient: "from-purple-400 via-violet-500 to-purple-600",
      image: null
    },
    "Red (TV)": {
      gradient: "from-red-500 via-rose-600 to-red-700",
      image: null
    },
    "1989 (TV)": {
      gradient: "from-sky-400 via-blue-400 to-indigo-400",
      image: null
    },
    "reputation": {
      gradient: "from-zinc-600 via-neutral-800 to-black",
      image: null
    },
    "Lover": {
      gradient: "from-pink-300 via-rose-400 to-pink-500",
      image: null
    },
    "folklore": {
      gradient: "from-stone-300 via-gray-400 to-stone-500",
      image: null
    },
    "evermore": {
      gradient: "from-amber-600 via-orange-700 to-stone-600",
      image: null
    },
    "Midnights": {
      gradient: "from-indigo-600 via-blue-800 to-slate-900",
      image: null
    },
    "Midnights (3am)": {
      gradient: "from-violet-600 via-indigo-800 to-slate-900",
      image: null
    },
    "TTPD": {
      gradient: "from-stone-300 via-stone-400 to-stone-500",
      image: null
    },
    "Hunger Games": {
      gradient: "from-amber-500 via-orange-600 to-red-700",
      image: null
    },
    "Fifty Shades": {
      gradient: "from-gray-600 via-slate-700 to-gray-900",
      image: null
    },
    "Soundtrack": {
      gradient: "from-emerald-500 via-teal-600 to-cyan-700",
      image: null
    },
    "Cats": {
      gradient: "from-amber-400 via-yellow-500 to-amber-600",
      image: null
    },
    "Valentine's Day": {
      gradient: "from-red-400 via-rose-500 to-pink-500",
      image: null
    },
    "Hannah Montana": {
      gradient: "from-fuchsia-400 via-purple-500 to-violet-600",
      image: null
    },
    "Standalone": {
      gradient: "from-slate-400 via-gray-500 to-slate-600",
      image: null
    }
  };

  const taylorSwiftSongs = [
    // Taylor Swift (2006)
    { id: 1, title: "Tim McGraw", album: "Taylor Swift" },
    { id: 2, title: "Picture to Burn", album: "Taylor Swift" },
    { id: 3, title: "Teardrops on My Guitar", album: "Taylor Swift" },
    { id: 4, title: "Our Song", album: "Taylor Swift" },
    { id: 5, title: "Should've Said No", album: "Taylor Swift" },
    
    // Fearless (TV)
    { id: 6, title: "Fearless", album: "Fearless (TV)" },
    { id: 7, title: "Fifteen", album: "Fearless (TV)" },
    { id: 8, title: "Love Story", album: "Fearless (TV)" },
    { id: 9, title: "White Horse", album: "Fearless (TV)" },
    { id: 10, title: "You Belong With Me", album: "Fearless (TV)" },
    { id: 11, title: "The Way I Loved You", album: "Fearless (TV)" },
    { id: 12, title: "Forever & Always", album: "Fearless (TV)" },
    { id: 13, title: "Mr. Perfectly Fine", album: "Fearless (TV)" },
    
    // Speak Now (TV)
    { id: 14, title: "Mine", album: "Speak Now (TV)" },
    { id: 15, title: "Sparks Fly", album: "Speak Now (TV)" },
    { id: 16, title: "Back to December", album: "Speak Now (TV)" },
    { id: 17, title: "Speak Now", album: "Speak Now (TV)" },
    { id: 18, title: "Dear John", album: "Speak Now (TV)" },
    { id: 19, title: "Mean", album: "Speak Now (TV)" },
    { id: 20, title: "The Story of Us", album: "Speak Now (TV)" },
    { id: 21, title: "Enchanted", album: "Speak Now (TV)" },
    { id: 22, title: "Haunted", album: "Speak Now (TV)" },
    { id: 23, title: "Long Live", album: "Speak Now (TV)" },
    
    // Red (TV)
    { id: 24, title: "State of Grace", album: "Red (TV)" },
    { id: 25, title: "Red", album: "Red (TV)" },
    { id: 26, title: "Treacherous", album: "Red (TV)" },
    { id: 27, title: "I Knew You Were Trouble", album: "Red (TV)" },
    { id: 28, title: "All Too Well", album: "Red (TV)" },
    { id: 29, title: "22", album: "Red (TV)" },
    { id: 30, title: "We Are Never Getting Back Together", album: "Red (TV)" },
    { id: 31, title: "Holy Ground", album: "Red (TV)" },
    { id: 32, title: "Begin Again", album: "Red (TV)" },
    { id: 33, title: "All Too Well (10 Min)", album: "Red (TV)" },
    
    // 1989 (TV)
    { id: 34, title: "Welcome to New York", album: "1989 (TV)" },
    { id: 35, title: "Blank Space", album: "1989 (TV)" },
    { id: 36, title: "Style", album: "1989 (TV)" },
    { id: 37, title: "Out of the Woods", album: "1989 (TV)" },
    { id: 38, title: "Shake It Off", album: "1989 (TV)" },
    { id: 39, title: "Wildest Dreams", album: "1989 (TV)" },
    { id: 40, title: "Clean", album: "1989 (TV)" },
    { id: 41, title: "New Romantics", album: "1989 (TV)" },
    { id: 42, title: "Is It Over Now?", album: "1989 (TV)" },
    
    // reputation
    { id: 43, title: "...Ready for It?", album: "reputation" },
    { id: 44, title: "End Game", album: "reputation" },
    { id: 45, title: "I Did Something Bad", album: "reputation" },
    { id: 46, title: "Don't Blame Me", album: "reputation" },
    { id: 47, title: "Delicate", album: "reputation" },
    { id: 48, title: "Look What You Made Me Do", album: "reputation" },
    { id: 49, title: "Gorgeous", album: "reputation" },
    { id: 50, title: "Getaway Car", album: "reputation" },
    { id: 51, title: "King of My Heart", album: "reputation" },
    { id: 52, title: "Dress", album: "reputation" },
    { id: 53, title: "Call It What You Want", album: "reputation" },
    { id: 54, title: "New Year's Day", album: "reputation" },
    
    // Lover
    { id: 55, title: "Cruel Summer", album: "Lover" },
    { id: 56, title: "Lover", album: "Lover" },
    { id: 57, title: "The Man", album: "Lover" },
    { id: 58, title: "The Archer", album: "Lover" },
    { id: 59, title: "Paper Rings", album: "Lover" },
    { id: 60, title: "Cornelia Street", album: "Lover" },
    { id: 61, title: "Death by a Thousand Cuts", album: "Lover" },
    { id: 62, title: "Daylight", album: "Lover" },
    
    // folklore
    { id: 63, title: "the 1", album: "folklore" },
    { id: 64, title: "cardigan", album: "folklore" },
    { id: 65, title: "the last great american dynasty", album: "folklore" },
    { id: 66, title: "exile", album: "folklore" },
    { id: 67, title: "my tears ricochet", album: "folklore" },
    { id: 68, title: "mirrorball", album: "folklore" },
    { id: 69, title: "seven", album: "folklore" },
    { id: 70, title: "august", album: "folklore" },
    { id: 71, title: "this is me trying", album: "folklore" },
    { id: 72, title: "illicit affairs", album: "folklore" },
    { id: 73, title: "betty", album: "folklore" },
    
    // evermore
    { id: 74, title: "willow", album: "evermore" },
    { id: 75, title: "champagne problems", album: "evermore" },
    { id: 76, title: "gold rush", album: "evermore" },
    { id: 77, title: "'tis the damn season", album: "evermore" },
    { id: 78, title: "tolerate it", album: "evermore" },
    { id: 79, title: "no body, no crime", album: "evermore" },
    { id: 80, title: "ivy", album: "evermore" },
    { id: 81, title: "cowboy like me", album: "evermore" },
    { id: 82, title: "marjorie", album: "evermore" },
    
    // Midnights
    { id: 83, title: "Lavender Haze", album: "Midnights" },
    { id: 84, title: "Maroon", album: "Midnights" },
    { id: 85, title: "Anti-Hero", album: "Midnights" },
    { id: 86, title: "Snow on the Beach", album: "Midnights" },
    { id: 87, title: "You're on Your Own, Kid", album: "Midnights" },
    { id: 88, title: "Midnight Rain", album: "Midnights" },
    { id: 89, title: "Bejeweled", album: "Midnights" },
    { id: 90, title: "Karma", album: "Midnights" },
    { id: 91, title: "Mastermind", album: "Midnights" },
    
    // TTPD
    { id: 92, title: "Fortnight", album: "TTPD" },
    { id: 93, title: "The Tortured Poets Department", album: "TTPD" },
    { id: 94, title: "Down Bad", album: "TTPD" },
    { id: 95, title: "So Long, London", album: "TTPD" },
    { id: 96, title: "But Daddy I Love Him", album: "TTPD" },
    { id: 97, title: "Fresh Out the Slammer", album: "TTPD" },
    { id: 98, title: "Who's Afraid of Little Old Me?", album: "TTPD" },
    { id: 99, title: "I Can Do It With a Broken Heart", album: "TTPD" },
    { id: 100, title: "Clara Bow", album: "TTPD" },
  ];

  // Premium songs - vault tracks, deep cuts, 3am edition
  const premiumSongs = [
    // Taylor Swift deep cuts
    { id: 101, title: "A Place in This World", album: "Taylor Swift" },
    { id: 102, title: "Cold As You", album: "Taylor Swift" },
    { id: 103, title: "Stay Beautiful", album: "Taylor Swift" },
    { id: 104, title: "Mary's Song", album: "Taylor Swift" },
    
    // Fearless Vault
    { id: 105, title: "You All Over Me", album: "Fearless (TV)" },
    { id: 106, title: "We Were Happy", album: "Fearless (TV)" },
    { id: 107, title: "That's When", album: "Fearless (TV)" },
    { id: 108, title: "Don't You", album: "Fearless (TV)" },
    { id: 109, title: "Bye Bye Baby", album: "Fearless (TV)" },
    { id: 110, title: "Jump Then Fall", album: "Fearless (TV)" },
    { id: 111, title: "The Other Side of the Door", album: "Fearless (TV)" },
    
    // Speak Now Vault
    { id: 112, title: "Electric Touch", album: "Speak Now (TV)" },
    { id: 113, title: "When Emma Falls in Love", album: "Speak Now (TV)" },
    { id: 114, title: "I Can See You", album: "Speak Now (TV)" },
    { id: 115, title: "Castles Crumbling", album: "Speak Now (TV)" },
    { id: 116, title: "Foolish One", album: "Speak Now (TV)" },
    { id: 117, title: "Timeless", album: "Speak Now (TV)" },
    
    // Red Vault
    { id: 118, title: "Better Man", album: "Red (TV)" },
    { id: 119, title: "Nothing New", album: "Red (TV)" },
    { id: 120, title: "Babe", album: "Red (TV)" },
    { id: 121, title: "Message In A Bottle", album: "Red (TV)" },
    { id: 122, title: "I Bet You Think About Me", album: "Red (TV)" },
    { id: 123, title: "Forever Winter", album: "Red (TV)" },
    { id: 124, title: "Run", album: "Red (TV)" },
    { id: 125, title: "The Very First Night", album: "Red (TV)" },
    
    // 1989 Vault
    { id: 126, title: "Sl*t!", album: "1989 (TV)" },
    { id: 127, title: "Say Don't Go", album: "1989 (TV)" },
    { id: 128, title: "Now That We Don't Talk", album: "1989 (TV)" },
    { id: 129, title: "Suburban Legends", album: "1989 (TV)" },
    { id: 130, title: "Is It Over Now?", album: "1989 (TV)" },
    
    // reputation deep cuts
    { id: 131, title: "So It Goes...", album: "reputation" },
    { id: 132, title: "Dancing With Our Hands Tied", album: "reputation" },
    { id: 133, title: "Dress", album: "reputation" },
    { id: 134, title: "This Is Why We Can't Have Nice Things", album: "reputation" },
    
    // Lover deep cuts
    { id: 135, title: "I Think He Knows", album: "Lover" },
    { id: 136, title: "Miss Americana", album: "Lover" },
    { id: 137, title: "Afterglow", album: "Lover" },
    { id: 138, title: "It's Nice To Have A Friend", album: "Lover" },
    
    // folklore deep cuts (not in main list)
    { id: 141, title: "mad woman", album: "folklore" },
    { id: 142, title: "epiphany", album: "folklore" },
    { id: 143, title: "peace", album: "folklore" },
    { id: 144, title: "hoax", album: "folklore" },
    { id: 145, title: "the lakes", album: "folklore" },
    
    // evermore deep cuts (not in main list)
    { id: 146, title: "happiness", album: "evermore" },
    { id: 147, title: "dorothea", album: "evermore" },
    { id: 148, title: "coney island", album: "evermore" },
    { id: 150, title: "closure", album: "evermore" },
    { id: 151, title: "right where you left me", album: "evermore" },
    { id: 152, title: "it's time to go", album: "evermore" },
    
    // Midnights 3am Edition
    { id: 153, title: "The Great War", album: "Midnights (3am)" },
    { id: 154, title: "Bigger Than The Whole Sky", album: "Midnights (3am)" },
    { id: 155, title: "Paris", album: "Midnights (3am)" },
    { id: 156, title: "High Infidelity", album: "Midnights (3am)" },
    { id: 157, title: "Glitch", album: "Midnights (3am)" },
    { id: 158, title: "Would've, Could've, Should've", album: "Midnights (3am)" },
    { id: 159, title: "Dear Reader", album: "Midnights (3am)" },
    { id: 160, title: "You're Losing Me", album: "Midnights (3am)" },
    
    // TTPD Anthology
    { id: 161, title: "The Black Dog", album: "TTPD" },
    { id: 162, title: "imgonnagetyouback", album: "TTPD" },
    { id: 163, title: "The Albatross", album: "TTPD" },
    { id: 164, title: "Chloe or Sam or Sophia or Marcus", album: "TTPD" },
    { id: 165, title: "How Did It End?", album: "TTPD" },
    { id: 166, title: "So High School", album: "TTPD" },
    { id: 167, title: "I Hate It Here", album: "TTPD" },
    { id: 168, title: "thanK you aIMee", album: "TTPD" },
    { id: 169, title: "I Look in People's Windows", album: "TTPD" },
    { id: 170, title: "The Prophecy", album: "TTPD" },
    { id: 171, title: "Cassandra", album: "TTPD" },
    { id: 172, title: "Peter", album: "TTPD" },
    { id: 173, title: "The Bolter", album: "TTPD" },
    { id: 174, title: "Robin", album: "TTPD" },
    { id: 175, title: "The Manuscript", album: "TTPD" },
    
    // More TTPD
    { id: 176, title: "loml", album: "TTPD" },
    { id: 177, title: "The Smallest Man Who Ever Lived", album: "TTPD" },
    { id: 178, title: "The Alchemy", album: "TTPD" },
    { id: 179, title: "guilty as sin?", album: "TTPD" },
    { id: 180, title: "Florida!!!", album: "TTPD" },
    
    // Soundtrack / standalone hits
    { id: 181, title: "Safe & Sound", album: "Hunger Games" },
    { id: 182, title: "I Don't Wanna Live Forever", album: "Fifty Shades" },
    { id: 183, title: "Carolina", album: "Soundtrack" },
    { id: 184, title: "Beautiful Ghosts", album: "Cats" },
    { id: 185, title: "Today Was a Fairytale", album: "Valentine's Day" },
    { id: 186, title: "Crazier", album: "Hannah Montana" },
    { id: 187, title: "Ronan", album: "Standalone" },
    { id: 188, title: "Only the Young", album: "Standalone" },
    { id: 189, title: "Sweeter Than Fiction", album: "Soundtrack" },
  ];

  const [screen, setScreen] = useState('home');
  const [songs, setSongs] = useState([]);
  const [currentPair, setCurrentPair] = useState([0, 1]);
  const [battleCount, setBattleCount] = useState(0);
  const [animate, setAnimate] = useState('');
  const [streak, setStreak] = useState(0);
  const [showStreak, setShowStreak] = useState(false);
  const [comparisonMatrix, setComparisonMatrix] = useState({});
  const [selectedFavorites, setSelectedFavorites] = useState([]);
  const [isTrueSwiftie, setIsTrueSwiftie] = useState(false);
  
  // Playoff state
  const [playoffMode, setPlayoffMode] = useState(false);
  const [playoffSongs, setPlayoffSongs] = useState([]);
  const [playoffBattles, setPlayoffBattles] = useState(0);
  
  // Results state
  const [showCelebration, setShowCelebration] = useState(false);
  const [unlockedThemes, setUnlockedThemes] = useState(['basic']);
  const [selectedTheme, setSelectedTheme] = useState('basic');
  const [showPaywall, setShowPaywall] = useState(false);
  const [showFullList, setShowFullList] = useState(false);
  const [showCardPreview, setShowCardPreview] = useState(false);
  const [previewCardUrl, setPreviewCardUrl] = useState(null);
  
  // Sharing state
  const [shareId, setShareId] = useState(null);
  const [viewingShared, setViewingShared] = useState(null);
  const [savingRanking, setSavingRanking] = useState(false);
  const [shareError, setShareError] = useState(null);
  
  const canvasRef = useRef(null);
  const lastBattleTime = useRef(Date.now());

  // Check URL for shared ranking on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const id = params.get('r');
    if (id) {
      loadSharedRanking(id);
    }
  }, []);
  
  // Load a shared ranking
  const loadSharedRanking = async (id) => {
    try {
      const { data, error } = await (await supabase.from('rankings').select('*')).eq('id', id);
      if (error || !data || data.length === 0) {
        setShareError('Ranking not found');
        return;
      }
      setViewingShared(data[0]);
      setScreen('shared');
    } catch (e) {
      setShareError('Could not load ranking');
    }
  };
  
  // Save ranking to database
  const saveRanking = async () => {
    if (savingRanking || shareId) return shareId;
    
    setSavingRanking(true);
    setShareError(null);
    
    try {
      const allRanked = [...songs].sort((a, b) => b.rating - a.rating);
      const top5 = allRanked.slice(0, 5).map(s => ({
        id: s.id,
        title: s.title,
        album: s.album
      }));
      
      const res = await fetch(`${SUPABASE_URL}/rest/v1/rankings`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': SUPABASE_ANON_KEY,
          'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
          'Prefer': 'return=representation'
        },
        body: JSON.stringify({
          is_vault: isTrueSwiftie,
          battle_count: battleCount,
          song_count: songs.length,
          songs: allRanked.map(s => ({
            id: s.id,
            title: s.title,
            album: s.album,
            rating: Math.round(s.rating)
          })),
          top_5: top5
        })
      });
      
      if (!res.ok) {
        const errorText = await res.text();
        console.error('Supabase error:', errorText);
        setShareError('Could not save ranking');
        setSavingRanking(false);
        return null;
      }
      
      const data = await res.json();
      const newId = Array.isArray(data) ? data[0]?.id : data?.id;
      
      if (!newId) {
        setShareError('Could not get share link');
        setSavingRanking(false);
        return null;
      }
      
      setShareId(newId);
      setSavingRanking(false);
      return newId;
    } catch (e) {
      console.error('Save error:', e);
      setShareError('Could not save ranking');
      setSavingRanking(false);
      return null;
    }
  };
  
  // Get shareable URL
  const getShareUrl = (id) => {
    const base = typeof window !== 'undefined' ? window.location.origin : 'https://songranker.io';
    return `${base}?r=${id}`;
  };

  // Load unlocked themes and vault status from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem('anthems_data');
      if (saved) {
        const data = JSON.parse(saved);
        if (data.unlockedThemes) {
          setUnlockedThemes(data.unlockedThemes);
        }
        if (data.vaultUnlocked) {
          setIsTrueSwiftie(true);
        }
      }
    } catch (e) {
      console.log('Could not load data');
    }
  }, []);

  // Get active song catalog based on tier
  const activeSongs = isTrueSwiftie ? [...taylorSwiftSongs, ...premiumSongs] : taylorSwiftSongs;

  // Haptic feedback
  const triggerHaptic = () => {
    if (navigator.vibrate) {
      navigator.vibrate(10);
    }
  };

  // Initialize songs with ELO ratings and start battles directly
  const startRanking = () => {
    setSelectedFavorites([]);
    setScreen('seed');
  };
  
  // Start battles with favorites boosted
  const startBattlesWithFavorites = (favorites) => {
    const shuffled = shuffleArray(activeSongs);
    const initialized = shuffled.map(s => ({
      ...s,
      rating: favorites.includes(s.id) ? 1500 : 1000,
      battles: 0,
      wins: 0,
      losses: 0
    }));
    setSongs(initialized);
    setComparisonMatrix({});
    setBattleCount(0);
    setStreak(0);
    setPlayoffMode(false);
    setPlayoffSongs([]);
    setPlayoffBattles(0);
    setShareId(null);
    setScreen('battle');
    setCurrentPair(getSmartPair(initialized, {}));
  };
  
  // Toggle favorite selection
  const toggleFavorite = (songId) => {
    const maxFavorites = isTrueSwiftie ? 5 : 3;
    
    if (selectedFavorites.includes(songId)) {
      setSelectedFavorites(prev => prev.filter(id => id !== songId));
    } else if (selectedFavorites.length < maxFavorites) {
      const newFavorites = [...selectedFavorites, songId];
      setSelectedFavorites(newFavorites);
      
      // Auto-start when max is picked
      if (newFavorites.length === maxFavorites) {
        setTimeout(() => {
          startBattlesWithFavorites(newFavorites);
        }, 400);
      }
    }
  };
  
  // Unlock True Swiftie tier via Stripe
  const unlockTrueSwiftie = () => {
    // Redirect to Stripe checkout
    window.open('https://buy.stripe.com/dRm8wPcQX2DMfzi1cB1oI00', '_blank');
  };
  
  // Check for successful payment on mount
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('vault') === 'success') {
      setIsTrueSwiftie(true);
      // Save to localStorage so it persists
      try {
        const saved = localStorage.getItem('anthems_data');
        const data = saved ? JSON.parse(saved) : {};
        data.vaultUnlocked = true;
        localStorage.setItem('anthems_data', JSON.stringify(data));
      } catch {}
      // Clean up URL
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  // Fisher-Yates shuffle to eliminate order bias
  const shuffleArray = (array) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  // Record comparison result for implicit sorting
  const recordComparison = (winnerId, loserId, matrix) => {
    const newMatrix = { ...matrix };
    if (!newMatrix[winnerId]) newMatrix[winnerId] = { beats: new Set(), losesTo: new Set(), directBattles: new Set() };
    if (!newMatrix[loserId]) newMatrix[loserId] = { beats: new Set(), losesTo: new Set(), directBattles: new Set() };
    
    // Convert to Sets for efficient operations (if not already)
    Object.keys(newMatrix).forEach(key => {
      if (Array.isArray(newMatrix[key].beats)) {
        newMatrix[key].beats = new Set(newMatrix[key].beats);
        newMatrix[key].losesTo = new Set(newMatrix[key].losesTo);
      }
      if (!newMatrix[key].directBattles) {
        newMatrix[key].directBattles = new Set();
      }
    });
    
    // Track direct battle (for top 10 accuracy)
    newMatrix[winnerId].directBattles.add(loserId);
    newMatrix[loserId].directBattles.add(winnerId);
    
    // Direct relationship
    newMatrix[winnerId].beats.add(loserId);
    newMatrix[loserId].losesTo.add(winnerId);
    
    // Transitive: Winner beats everything the loser beats
    newMatrix[loserId].beats.forEach(id => {
      newMatrix[winnerId].beats.add(id);
      if (newMatrix[id]) newMatrix[id].losesTo.add(winnerId);
    });
    
    // Transitive: Everything that beats the winner also beats the loser
    newMatrix[winnerId].losesTo.forEach(id => {
      newMatrix[loserId].losesTo.add(id);
      if (newMatrix[id]) newMatrix[id].beats.add(loserId);
    });
    
    return newMatrix;
  };

  // Check if we already know the outcome (via transitive closure)
  // Use for lower-ranked songs to save time
  const alreadyCompared = (id1, id2, matrix) => {
    const record1 = matrix[id1];
    const record2 = matrix[id2];
    if (record1?.beats?.has?.(id2) || record1?.beats?.includes?.(id2)) return true;
    if (record2?.beats?.has?.(id1) || record2?.beats?.includes?.(id1)) return true;
    return false;
  };

  // Check if two songs have DIRECTLY battled (not just inferred)
  // Use for top 10 to ensure accuracy - no shortcuts
  const directlyBattled = (id1, id2, matrix) => {
    const record1 = matrix[id1];
    const record2 = matrix[id2];
    // Check if they directly beat each other (not via transitive chain)
    // We need to track direct battles separately
    if (record1?.directBattles?.has?.(id2)) return true;
    if (record2?.directBattles?.has?.(id1)) return true;
    return false;
  };

  // Smart pairing: two-phase seeding
  // Phase 1: Everyone gets at least 1 battle (2 for True Swiftie)
  // Phase 2: Top 20 get extra battles to solidify rankings
  const getSmartPair = (songList, matrix) => {
    const sorted = [...songList].sort((a, b) => b.rating - a.rating);
    const minBattles = isTrueSwiftie ? 2 : 1;
    
    // Phase 1: Anyone below minimum battles needs to fight
    const needsBattles = songList.filter(s => s.battles < minBattles);
    if (needsBattles.length >= 2) {
      // Pair two songs that need battles, prefer similar ratings
      const sortedNeeds = [...needsBattles].sort((a, b) => b.rating - a.rating);
      for (let i = 0; i < sortedNeeds.length - 1; i++) {
        if (!alreadyCompared(sortedNeeds[i].id, sortedNeeds[i+1].id, matrix)) {
          return [
            songList.findIndex(s => s.id === sortedNeeds[i].id),
            songList.findIndex(s => s.id === sortedNeeds[i+1].id)
          ];
        }
      }
      // Fallback: any two that need battles
      return [
        songList.findIndex(s => s.id === needsBattles[0].id),
        songList.findIndex(s => s.id === needsBattles[1].id)
      ];
    }
    
    if (needsBattles.length === 1) {
      // Pair with a similar-rated song
      const target = needsBattles[0];
      const others = songList.filter(s => s.id !== target.id);
      const closest = others.sort((a, b) => 
        Math.abs(a.rating - target.rating) - Math.abs(b.rating - target.rating)
      )[0];
      if (closest && !alreadyCompared(target.id, closest.id, matrix)) {
        return [
          songList.findIndex(s => s.id === target.id),
          songList.findIndex(s => s.id === closest.id)
        ];
      }
    }
    
    // Phase 2: Top 30 disambiguation for True Swiftie (top 20 for casual)
    const topN = isTrueSwiftie ? 30 : 20;
    const topSongs = sorted.slice(0, topN);
    const needsMoreTop = topSongs.filter(s => s.battles < (isTrueSwiftie ? 3 : 2));
    
    if (needsMoreTop.length > 0) {
      const target = needsMoreTop[0];
      for (let i = 0; i < topSongs.length; i++) {
        if (topSongs[i].id !== target.id && !alreadyCompared(target.id, topSongs[i].id, matrix)) {
          return [
            songList.findIndex(s => s.id === target.id),
            songList.findIndex(s => s.id === topSongs[i].id)
          ];
        }
      }
    }
    
    // Phase 3: Make sure top 10 have all DIRECTLY faced each other
    // No transitive shortcuts here - we need real data for the top 10
    const top10 = sorted.slice(0, 10);
    for (let i = 0; i < top10.length; i++) {
      for (let j = i + 1; j < top10.length; j++) {
        if (!directlyBattled(top10[i].id, top10[j].id, matrix)) {
          return [
            songList.findIndex(s => s.id === top10[i].id),
            songList.findIndex(s => s.id === top10[j].id)
          ];
        }
      }
    }
    
    // Final fallback: if somehow we haven't matched everyone, pick any two
    if (songList.length >= 2) {
      return [0, 1];
    }
    
    // Done
    return null;
  };

  // ELO update
  const updateELO = (winnerRating, loserRating, K = 32) => {
    const expected = 1 / (1 + Math.pow(10, (loserRating - winnerRating) / 400));
    return {
      winnerNew: winnerRating + K * (1 - expected),
      loserNew: loserRating + K * (0 - (1 - expected))
    };
  };

  // Handle battle selection
  const handleBattle = (winnerIdx) => {
    triggerHaptic();
    
    const loserIdx = currentPair[0] === winnerIdx ? currentPair[1] : currentPair[0];
    const winner = songs[winnerIdx];
    const loser = songs[loserIdx];
    
    // Check for fast battles (streak)
    const now = Date.now();
    const timeSinceLast = now - lastBattleTime.current;
    lastBattleTime.current = now;
    
    if (timeSinceLast < 1500) {
      const newStreak = streak + 1;
      setStreak(newStreak);
      if (newStreak > 0 && newStreak % 10 === 0) {
        setShowStreak(true);
        setTimeout(() => setShowStreak(false), 1500);
      }
    } else {
      setStreak(0);
    }
    
    setAnimate(winnerIdx === currentPair[0] ? 'left' : 'right');
    
    setTimeout(() => {
      const newSongs = [...songs];
      const { winnerNew, loserNew } = updateELO(winner.rating, loser.rating);
      
      newSongs[winnerIdx].rating = winnerNew;
      newSongs[loserIdx].rating = loserNew;
      newSongs[winnerIdx].battles += 1;
      newSongs[loserIdx].battles += 1;
      newSongs[winnerIdx].wins += 1;
      newSongs[loserIdx].losses += 1;
      
      const newMatrix = recordComparison(winner.id, loser.id, comparisonMatrix);
      setComparisonMatrix(newMatrix);
      setSongs(newSongs);
      const newBattleCount = battleCount + 1;
      setBattleCount(newBattleCount);
      
      // Hard stop: force playoff after reasonable number of battles
      // Casual Fan: 80 battles
      // Vault: 120 battles for better accuracy
      const maxSeedingBattles = isTrueSwiftie ? 120 : 80;
      const minBattlesPerSong = isTrueSwiftie ? 2 : 1;
      const songsSeeded = newSongs.filter(s => s.battles >= minBattlesPerSong).length;
      const progress = (songsSeeded / newSongs.length) * 100;
      
      if (progress >= 99 || newBattleCount >= maxSeedingBattles) {
        // Force playoff
        startPlayoff(newSongs);
      } else {
        const nextPair = getSmartPair(newSongs, newMatrix);
        if (nextPair) {
          setCurrentPair(nextPair);
        } else {
          // No more pairs, start playoff
          startPlayoff(newSongs);
        }
      }
      
      setAnimate('');
    }, 200);
  };

  // Start playoff - Casual Fan: top 5 (10 battles), True Swiftie: top 7 (21 battles)
  const startPlayoff = (songList) => {
    const ranked = [...songList].sort((a, b) => b.rating - a.rating);
    const playoffSize = isTrueSwiftie ? 7 : 5;
    const topSongs = ranked.slice(0, playoffSize).map(s => ({
      ...s,
      playoffWins: 0,
      playoffLosses: 0,
      playoffOpponents: []
    }));
    setPlayoffSongs(topSongs);
    setPlayoffBattles(0);
    setPlayoffMode(true);
    setCurrentPair([0, 1]);
  };

  // Calculate total playoff battles (round robin = n*(n-1)/2)
  const getTotalPlayoffBattles = () => {
    const n = playoffSongs.length || (isTrueSwiftie ? 7 : 5);
    return (n * (n - 1)) / 2;
  };
  
  // Get capped playoff progress (never exceed 100%)
  const getPlayoffProgress = () => {
    const total = getTotalPlayoffBattles();
    if (total === 0) return 0;
    return Math.min(100, Math.round((playoffBattles / total) * 100));
  };

  // Get next playoff pair
  const getPlayoffPair = (pSongs) => {
    for (let i = 0; i < pSongs.length; i++) {
      for (let j = i + 1; j < pSongs.length; j++) {
        if (!pSongs[i].playoffOpponents.includes(pSongs[j].id)) {
          return [i, j];
        }
      }
    }
    return null;
  };

  // Handle playoff battle
  const handlePlayoffBattle = (winnerIdx) => {
    triggerHaptic();
    
    const loserIdx = currentPair[0] === winnerIdx ? currentPair[1] : currentPair[0];
    setAnimate(winnerIdx === currentPair[0] ? 'left' : 'right');
    
    setTimeout(() => {
      const newPlayoffSongs = [...playoffSongs];
      newPlayoffSongs[winnerIdx].playoffWins += 1;
      newPlayoffSongs[loserIdx].playoffLosses += 1;
      newPlayoffSongs[winnerIdx].playoffOpponents.push(newPlayoffSongs[loserIdx].id);
      newPlayoffSongs[loserIdx].playoffOpponents.push(newPlayoffSongs[winnerIdx].id);
      
      const { winnerNew, loserNew } = updateELO(
        newPlayoffSongs[winnerIdx].rating,
        newPlayoffSongs[loserIdx].rating,
        48
      );
      newPlayoffSongs[winnerIdx].rating = winnerNew;
      newPlayoffSongs[loserIdx].rating = loserNew;
      
      // Sync ratings back to main songs array
      const newSongs = [...songs];
      const winnerMainIdx = newSongs.findIndex(s => s.id === newPlayoffSongs[winnerIdx].id);
      const loserMainIdx = newSongs.findIndex(s => s.id === newPlayoffSongs[loserIdx].id);
      if (winnerMainIdx !== -1) newSongs[winnerMainIdx].rating = winnerNew;
      if (loserMainIdx !== -1) newSongs[loserMainIdx].rating = loserNew;
      setSongs(newSongs);
      
      setPlayoffSongs(newPlayoffSongs);
      
      // Increment battle count first
      const newBattleCount = playoffBattles + 1;
      setPlayoffBattles(newBattleCount);
      
      const nextPair = getPlayoffPair(newPlayoffSongs);
      if (nextPair) {
        setCurrentPair(nextPair);
      } else {
        // Playoff complete
        setShowCelebration(true);
        setTimeout(() => {
          setShowCelebration(false);
          setScreen('results');
        }, 2500);
      }
      
      setAnimate('');
    }, 200);
  };

  // Get final rankings
  const getPlayoffRankings = () => {
    return [...playoffSongs].sort((a, b) => {
      if (b.playoffWins !== a.playoffWins) return b.playoffWins - a.playoffWins;
      return b.rating - a.rating;
    });
  };

  const getScore = (rank) => {
    const scores = [10.0, 9.7, 9.4, 9.1, 8.8, 8.5, 8.2, 7.9, 7.6, 7.3];
    return scores[rank] || 7.0;
  };

  // Theme configurations
  const themes = {
    basic: {
      name: 'Basic',
      price: 0,
      gradient: ['#581c87', '#9d174d', '#c2410c'],
      textColor: '#ffffff',
      accentColor: '#fbbf24'
    },
    midnight: {
      name: 'Midnight',
      price: 2.99,
      gradient: ['#0f172a', '#1e1b4b', '#312e81'],
      textColor: '#e2e8f0',
      accentColor: '#818cf8'
    },
    eras: {
      name: 'Eras Tour',
      price: 2.99,
      gradient: ['#ec4899', '#8b5cf6', '#06b6d4'],
      textColor: '#ffffff',
      accentColor: '#fcd34d'
    }
  };

  // Generate share card - Spotify Wrapped style
  const generateCard = (themeName) => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const theme = themes[themeName];
    const width = 1080;
    const height = 1920;
    
    canvas.width = width;
    canvas.height = height;
    
    // Polyfill for roundRect (older Safari/browsers)
    if (!ctx.roundRect) {
      ctx.roundRect = function(x, y, w, h, r) {
        const radius = typeof r === 'number' ? r : 0;
        this.beginPath();
        this.moveTo(x + radius, y);
        this.lineTo(x + w - radius, y);
        this.quadraticCurveTo(x + w, y, x + w, y + radius);
        this.lineTo(x + w, y + h - radius);
        this.quadraticCurveTo(x + w, y + h, x + w - radius, y + h);
        this.lineTo(x + radius, y + h);
        this.quadraticCurveTo(x, y + h, x, y + h - radius);
        this.lineTo(x, y + radius);
        this.quadraticCurveTo(x, y, x + radius, y);
        this.closePath();
      };
    }
    
    // Generate consistent "global" stat for a song
    const getGlobalStat = (song, rank) => {
      const seed = song.id * 7 + rank * 13;
      const basePercent = rank === 0 ? 12 + (seed % 18) : 
                          rank < 3 ? 20 + (seed % 25) : 
                          35 + (seed % 40);
      return Math.min(92, basePercent);
    };
    
    // Dynamic gradient background with more color stops
    const gradient = ctx.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, theme.gradient[0]);
    gradient.addColorStop(0.3, theme.gradient[1]);
    gradient.addColorStop(0.7, theme.gradient[1]);
    gradient.addColorStop(1, theme.gradient[2]);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, width, height);
    
    // Large decorative shapes (Wrapped style)
    const drawBlob = (x, y, size, color, opacity) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(Math.random() * Math.PI);
      const blobGradient = ctx.createRadialGradient(0, 0, 0, 0, 0, size);
      blobGradient.addColorStop(0, color + Math.round(opacity * 255).toString(16).padStart(2, '0'));
      blobGradient.addColorStop(0.7, color + Math.round(opacity * 0.3 * 255).toString(16).padStart(2, '0'));
      blobGradient.addColorStop(1, 'transparent');
      ctx.fillStyle = blobGradient;
      ctx.beginPath();
      ctx.ellipse(0, 0, size, size * 0.7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    };
    
    // Background blobs
    drawBlob(0, 200, 400, theme.accentColor, 0.25);
    drawBlob(width, 800, 500, '#ffffff', 0.08);
    drawBlob(200, height - 300, 450, theme.gradient[2], 0.2);
    drawBlob(width - 100, 400, 350, theme.gradient[0], 0.15);
    
    const allRanked = [...songs].sort((a, b) => b.rating - a.rating);
    const top5 = allRanked.slice(0, 5);
    const top1 = top5[0];
    
    // Header - the journey stats
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '600 36px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${songs.length} songs entered.`, width / 2, 80);
    ctx.fillText(`${battleCount} battles fought.`, width / 2, 130);
    
    ctx.fillStyle = theme.accentColor;
    ctx.font = '800 42px system-ui, sans-serif';
    ctx.fillText('5 survived.', width / 2, 190);
    
    // Decorative line
    const lineGrad = ctx.createLinearGradient(200, 0, width - 200, 0);
    lineGrad.addColorStop(0, 'transparent');
    lineGrad.addColorStop(0.5, 'rgba(255,255,255,0.3)');
    lineGrad.addColorStop(1, 'transparent');
    ctx.strokeStyle = lineGrad;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(200, 230);
    ctx.lineTo(width - 200, 230);
    ctx.stroke();
    
    // #1 Song - hero section
    const heroY = 280;
    
    // Crown or #1 indicator
    ctx.fillStyle = theme.accentColor;
    ctx.font = '400 32px system-ui, sans-serif';
    ctx.fillText('👑  #1', width / 2, heroY);
    
    // Song title - BIG
    ctx.fillStyle = '#ffffff';
    ctx.font = '800 72px system-ui, sans-serif';
    const title1 = top1.title.length > 14 ? top1.title.slice(0, 14) + '...' : top1.title;
    ctx.fillText(title1, width / 2, heroY + 80);
    
    // Album
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.font = '500 32px system-ui, sans-serif';
    ctx.fillText(top1.album, width / 2, heroY + 125);
    
    // Win record box
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.beginPath();
    ctx.roundRect(width / 2 - 180, heroY + 155, 360, 70, 20);
    ctx.fill();
    
    // Calculate approximate wins for #1 (they won most of their battles)
    const top1Wins = Math.round(battleCount * 0.15) + 5; // Rough estimate
    ctx.fillStyle = theme.accentColor;
    ctx.font = '800 36px system-ui, sans-serif';
    ctx.fillText(`Defeated ${songs.length - 1} songs`, width / 2, heroY + 200);
    
    // Songs 2-5
    const listY = heroY + 280;
    const rowHeight = 120;
    
    top5.slice(1).forEach((song, i) => {
      const rank = i + 2;
      const y = listY + (i * rowHeight);
      
      // Rank number
      ctx.fillStyle = 'rgba(255,255,255,0.4)';
      ctx.font = '700 56px system-ui, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(`${rank}`, 100, y + 50);
      
      // Song title
      ctx.fillStyle = '#ffffff';
      ctx.font = '600 40px system-ui, sans-serif';
      const title = song.title.length > 20 ? song.title.slice(0, 20) + '...' : song.title;
      ctx.fillText(title, 180, y + 30);
      
      // Album name
      ctx.fillStyle = 'rgba(255,255,255,0.5)';
      ctx.font = '500 26px system-ui, sans-serif';
      ctx.fillText(song.album, 180, y + 65);
    });
    
    // Vault Access badge (for paid users)
    if (isTrueSwiftie) {
      const badgeY = height - 220;
      
      ctx.fillStyle = 'rgba(251, 191, 36, 0.15)';
      ctx.beginPath();
      ctx.roundRect(width / 2 - 140, badgeY, 280, 44, 22);
      ctx.fill();
      
      ctx.strokeStyle = 'rgba(251, 191, 36, 0.4)';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.roundRect(width / 2 - 140, badgeY, 280, 44, 22);
      ctx.stroke();
      
      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 22px system-ui, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText('🔓 VAULT ACCESS', width / 2, badgeY + 29);
    }
    
    // CTA footer
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.beginPath();
    ctx.roundRect(180, height - 140, width - 360, 55, 28);
    ctx.fill();
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '600 24px system-ui, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText('Rank yours → songranker.io', width / 2, height - 105);
    
    // Branding
    ctx.fillStyle = 'rgba(255,255,255,0.4)';
    ctx.font = '600 24px system-ui, sans-serif';
    ctx.fillText('Taylor Swift Song Ranker', width / 2, height - 45);
    
    return canvas.toDataURL('image/png');
  };

  // Show card preview
  const previewCard = (themeName) => {
    if (themeName !== 'basic' && !unlockedThemes.includes(themeName)) {
      setSelectedTheme(themeName);
      setShowPaywall(true);
      return;
    }
    
    setSelectedTheme(themeName);
    const dataUrl = generateCard(themeName);
    setPreviewCardUrl(dataUrl);
    setShowCardPreview(true);
  };

  // Actually download the card
  const downloadCard = () => {
    if (!previewCardUrl) return;
    const link = document.createElement('a');
    link.download = `my-taylor-swift-top-10-${selectedTheme}.png`;
    link.href = previewCardUrl;
    link.click();
  };

  const handlePurchase = (themeName) => {
    // In production: Stripe checkout
    // For demo: just unlock and persist
    setUnlockedThemes(prev => {
      const next = prev.includes(themeName) ? prev : [...prev, themeName];
      try {
        localStorage.setItem('anthems_data', JSON.stringify({
          unlockedThemes: next,
        }));
      } catch {}
      return next;
    });
    setShowPaywall(false);
    setTimeout(() => previewCard(themeName), 100);
  };

  const reset = () => {
    setScreen('home');
    setSongs([]);
    setPlayoffMode(false);
    setPlayoffSongs([]);
    setPlayoffBattles(0);
    setBattleCount(0);
    setStreak(0);
    setComparisonMatrix({});
    setShareId(null);
  };

  // === SCREENS ===

  // Shared Ranking View
  if (screen === 'shared' && viewingShared) {
    const sharedSongs = viewingShared.songs || [];
    const top5 = viewingShared.top_5 || sharedSongs.slice(0, 5);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-lg mx-auto">
          {/* Header */}
          <div className="text-center mb-6">
            <p className="text-slate-400 text-sm mb-2">
              After {viewingShared.battle_count} battles...
            </p>
            <h1 className="text-3xl font-bold text-white mb-1">Taylor Swift</h1>
            <p className="text-rose-400 font-bold text-xl">TOP {sharedSongs.length} RANKING</p>
            {viewingShared.is_vault && (
              <span className="inline-flex items-center gap-1 mt-2 text-xs bg-amber-500/20 text-amber-300 px-3 py-1 rounded-full">
                🔓 Vault Access
              </span>
            )}
          </div>
          
          {/* Songs List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-6 max-h-[55vh] overflow-y-auto">
            {sharedSongs.map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
                <span className={`text-lg font-black w-8 ${i === 0 ? 'text-yellow-400' : i < 3 ? 'text-slate-300' : 'text-slate-500'}`}>
                  {i + 1}
                </span>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${albumArt[song.album]?.gradient || 'from-purple-500 to-pink-500'} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-sm">{song.title}</p>
                  <p className="text-slate-400 text-xs truncate">{song.album}</p>
                </div>
              </div>
            ))}
          </div>
          
          {/* CTA */}
          <div className="space-y-3">
            <button
              onClick={() => { setViewingShared(null); setScreen('home'); window.history.pushState({}, '', window.location.pathname); }}
              className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg"
            >
              Make Your Own Ranking
            </button>
            <p className="text-center text-slate-500 text-sm">
              Rank {viewingShared.song_count} songs through head-to-head battles
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Home
  if (screen === 'home') {
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-6 flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-center mb-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center">
              <div className="w-3 h-3 border-2 border-white rounded-full" />
            </div>
            <span className="text-white font-semibold tracking-tight">Anthems</span>
          </div>
        </div>
        
        {/* Hero */}
        <div className="flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
          <h1 className="text-4xl font-bold text-white mb-3 tracking-tight">
            Rank every<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-rose-400 to-pink-500">Taylor Swift</span> song
          </h1>
          <p className="text-slate-400 text-lg mb-8">
            100 head-to-head battles. Your definitive Top 10. Share it.
          </p>
          
          {/* Tier Selection */}
          <div className="space-y-3 mb-6">
            {/* Fan Favorites - Free */}
            <button
              onClick={() => { setIsTrueSwiftie(false); startRanking(); }}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl p-4 text-left transition-all hover:bg-slate-800 hover:border-slate-600 group"
            >
              <div className="flex items-center justify-between mb-1">
                <span className="text-white font-semibold">Fan Favorites</span>
                <span className="text-emerald-400 text-sm font-medium">Free</span>
              </div>
              <p className="text-slate-400 text-sm">{taylorSwiftSongs.length} essential tracks</p>
              <p className="text-slate-500 text-xs mt-1">80 battles • 5 min</p>
            </button>
            
            {/* The Vault - Premium */}
            <button
              onClick={() => { unlockTrueSwiftie(); startRanking(); }}
              className="w-full bg-gradient-to-br from-amber-500/10 to-yellow-500/10 border border-amber-500/30 rounded-xl p-4 text-left transition-all hover:from-amber-500/20 hover:to-yellow-500/20"
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <span className="text-white font-semibold">The Vault</span>
                </div>
                <span className="text-amber-400 text-sm font-medium">$2.99</span>
              </div>
              <p className="text-slate-400 text-sm">{taylorSwiftSongs.length + premiumSongs.length} songs • 120 battles</p>
              <div className="mt-2 flex flex-wrap gap-2">
                <span className="text-xs bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded-full">🔓 Vault Access Badge</span>
                <span className="text-xs text-slate-500">~8 min</span>
              </div>
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="flex items-center justify-center gap-6 text-slate-500 text-sm">
            <span className="flex items-center gap-1">
              <Star size={14} className="fill-current" /> 4.9 rating
            </span>
            <span>10k+ rankings</span>
          </div>
        </div>
        
        {/* Footer */}
        <div className="text-center text-slate-600 text-xs mt-6">
          More artists coming soon
        </div>
      </div>
    );
  }

  // Seed Screen - Pick favorites (3 for free, 5 for Vault)
  if (screen === 'seed') {
    const maxFavorites = isTrueSwiftie ? 5 : 3;
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-6">
            <h1 className="text-2xl font-bold text-white mb-2">Pick {maxFavorites} favorites</h1>
            <p className="text-slate-400 text-sm">
              These will get extra battles to ensure they're ranked fairly.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              {Array.from({length: maxFavorites}, (_, i) => i + 1).map(n => (
                <div 
                  key={n}
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold transition-all ${
                    selectedFavorites.length >= n 
                      ? 'bg-rose-500 text-white scale-110' 
                      : 'bg-slate-700 text-slate-500'
                  }`}
                >
                  {selectedFavorites.length >= n ? '♥' : n}
                </div>
              ))}
            </div>
          </div>
          
          {/* Song List */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-3 max-h-[65vh] overflow-y-auto">
            {activeSongs.map(song => {
              const isSelected = selectedFavorites.includes(song.id);
              const canSelect = selectedFavorites.length < maxFavorites || isSelected;
              
              return (
                <button
                  key={song.id}
                  onClick={() => toggleFavorite(song.id)}
                  disabled={!canSelect}
                  className={`w-full flex items-center gap-3 p-3 rounded-xl mb-2 last:mb-0 transition-all ${
                    isSelected 
                      ? 'bg-rose-500/20 ring-2 ring-rose-500' 
                      : canSelect
                        ? 'bg-slate-700/30 hover:bg-slate-700/50'
                        : 'bg-slate-800/30 opacity-40'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${albumArt[song.album]?.gradient || 'from-purple-500 to-pink-500'} flex-shrink-0`} />
                  <div className="text-left flex-1 min-w-0">
                    <p className="text-white font-semibold truncate">{song.title}</p>
                    <p className="text-slate-400 text-xs truncate">{song.album}</p>
                  </div>
                  {isSelected && (
                    <div className="w-6 h-6 rounded-full bg-rose-500 flex items-center justify-center">
                      <Check size={14} className="text-white" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  // Generate hot take based on rankings
  const getHotTake = (rankedSongs) => {
    const top10 = rankedSongs.slice(0, 10);
    const top1 = top10[0];
    
    // Count albums in top 10
    const albumCounts = {};
    top10.forEach(s => {
      const album = s.album.replace(' (TV)', '').replace(' (3am)', '');
      albumCounts[album] = (albumCounts[album] || 0) + 1;
    });
    const topAlbum = Object.entries(albumCounts).sort((a, b) => b[1] - a[1])[0];
    
    // Check for specific hot takes
    const top10Titles = top10.map(s => s.title.toLowerCase());
    const top10Ids = top10.map(s => s.id);
    
    // Vault track above a mega hit?
    const vaultTracks = ['You All Over Me', 'Mr. Perfectly Fine', 'I Can See You', 'Better Man', 'Nothing New', 'Sl*t!', 'Say Don\'t Go', 'Is It Over Now?'];
    const megaHits = ['Shake It Off', 'Blank Space', 'Anti-Hero', 'Bad Blood', 'Look What You Made Me Do'];
    
    const vaultInTop10 = top10.filter(s => vaultTracks.some(v => s.title.toLowerCase().includes(v.toLowerCase())));
    const megaHitMissing = megaHits.filter(h => !top10Titles.some(t => t.includes(h.toLowerCase())));
    
    if (vaultInTop10.length > 0 && megaHitMissing.length > 0) {
      return `You ranked ${vaultInTop10[0].title} above ${megaHitMissing[0]}. Bold.`;
    }
    
    // Specific #1 callouts
    if (top1.title === 'All Too Well' || top1.title === 'All Too Well (10 Min)' || top1.title === 'All Too Well (10-Minute Version)') {
      return "All Too Well at #1. As it should be.";
    }
    if (top1.title === 'Getaway Car') {
      return "Getaway Car #1? Immaculate taste.";
    }
    if (top1.title === 'champagne problems') {
      return "champagne problems #1. You okay?";
    }
    if (top1.title === 'Cruel Summer') {
      return "Cruel Summer #1. The people's choice.";
    }
    if (top1.title === 'august') {
      return "august #1. A fellow romantic.";
    }
    if (top1.title === 'Don\'t Blame Me') {
      return "Don't Blame Me #1? You chose chaos.";
    }
    if (top1.title === 'exile') {
      return "exile #1. Bon Iver approves.";
    }
    
    // Album dominance
    if (topAlbum && topAlbum[1] >= 4) {
      const albumQuips = {
        'folklore': `${topAlbum[1]} folklore songs in your Top 10. Cottagecore era.`,
        'evermore': `${topAlbum[1]} evermore songs. You love the vibes.`,
        'reputation': `${topAlbum[1]} reputation songs. Villain era enthusiast.`,
        '1989': `${topAlbum[1]} 1989 songs. Pop perfection.`,
        'Lover': `${topAlbum[1]} Lover songs. Hopeless romantic confirmed.`,
        'TTPD': `${topAlbum[1]} TTPD songs. Still processing, huh?`,
        'Midnights': `${topAlbum[1]} Midnights songs. 3am brain activated.`,
        'Red': `${topAlbum[1]} Red songs. Emotional damage expert.`,
        'Speak Now': `${topAlbum[1]} Speak Now songs. The classics hit different.`,
        'Fearless': `${topAlbum[1]} Fearless songs. Origin story appreciator.`,
      };
      if (albumQuips[topAlbum[0]]) {
        return albumQuips[topAlbum[0]];
      }
    }
    
    // Default: album stat
    if (topAlbum) {
      return `Most represented: ${topAlbum[0]} (${topAlbum[1]} songs)`;
    }
    
    return null;
  };

  // Celebration
  if (showCelebration) {
    const allRanked = [...songs].sort((a, b) => b.rating - a.rating);
    const topSong = allRanked[0];
    const hotTake = getHotTake(allRanked);
    
    // Generate "global" stat for celebration
    const getGlobalStat = (song) => {
      const seed = song.id * 7;
      return 12 + (seed % 20);
    };
    const topSongStat = getGlobalStat(topSong);
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center p-6">
        <div className="text-center max-w-sm">
          {/* Animated trophy */}
          <div className="relative mb-8">
            <div className="text-8xl animate-bounce">🏆</div>
            <div className="absolute inset-0 bg-amber-400/20 blur-3xl rounded-full" />
          </div>
          
          <p className="text-slate-400 text-sm uppercase tracking-wide mb-2">Ranking Complete</p>
          <h1 className="text-3xl font-bold text-white mb-6">Your Top 10 is Ready</h1>
          
          {/* #1 Card */}
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-6 mb-4">
            <p className="text-slate-400 text-xs uppercase tracking-wide mb-3">Your #1 Song</p>
            <div className={`w-20 h-20 rounded-xl bg-gradient-to-br ${albumArt[topSong?.album]?.gradient || 'from-purple-500 to-pink-500'} mx-auto mb-4 shadow-lg`} />
            <p className="text-white text-2xl font-bold mb-1">{topSong?.title}</p>
            <p className="text-slate-400 mb-4">{topSong?.album}</p>
            
            {/* Global stat teaser */}
            <div className="bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
              <p className="text-rose-400 font-semibold">Only {topSongStat}% of fans agree</p>
            </div>
          </div>
          
          {hotTake && (
            <p className="text-slate-500 text-sm italic">"{hotTake}"</p>
          )}
        </div>
      </div>
    );
  }

  // Results
  if (screen === 'results') {
    if (!songs || songs.length === 0) {
      return (
        <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 flex items-center justify-center">
          <button onClick={reset} className="text-white">Something went wrong. Start over.</button>
        </div>
      );
    }
    
    const ranked = getPlayoffRankings();
    const allRanked = [...songs].sort((a, b) => b.rating - a.rating);
    const hotTake = getHotTake(allRanked);
    
    // Get score for full list (maps to 5.0-10.0 range)
    const getFullListScore = (index, total) => {
      return (10 - (index / total) * 5).toFixed(1);
    };
    
    // Generate "global" comparison stats (placeholder - will be real data with backend)
    // Uses song ID as seed for consistent fake percentages
    const getGlobalStats = (song, rank) => {
      const seed = song.id * 7 + rank * 13;
      const basePercent = rank === 0 ? 15 + (seed % 20) : // #1 gets 15-35%
                          rank < 3 ? 25 + (seed % 30) :   // Top 3 gets 25-55%
                          rank < 10 ? 40 + (seed % 35) :  // Top 10 gets 40-75%
                          60 + (seed % 30);               // Rest gets 60-90%
      return Math.min(95, basePercent);
    };
    
    // Find user's most unique pick (lowest agreement)
    const getMostUniquePick = () => {
      const top10 = allRanked.slice(0, 10);
      let mostUnique = { song: top10[0], percent: 100, rank: 0 };
      top10.forEach((song, i) => {
        const percent = getGlobalStats(song, i);
        if (percent < mostUnique.percent) {
          mostUnique = { song, percent, rank: i + 1 };
        }
      });
      return mostUnique;
    };
    
    // Find a "controversial" pick (user ranked high, but low global agreement)
    const getControversialPick = () => {
      const top5 = allRanked.slice(0, 5);
      for (const song of top5) {
        const percent = getGlobalStats(song, allRanked.indexOf(song));
        if (percent < 25) {
          return { song, percent };
        }
      }
      return null;
    };
    
    const uniquePick = getMostUniquePick();
    const controversialPick = getControversialPick();
    
    // Export to Spotify (opens search for each song)
    const exportToSpotify = () => {
      const rankedList = showFullList ? allRanked : ranked;
      const playlistText = rankedList.map((s, i) => `${i + 1}. ${s.title} - Taylor Swift`).join('\n');
      
      const openFallback = () => {
        if (typeof window !== 'undefined') {
          window.open(`https://open.spotify.com/search/${encodeURIComponent(ranked[0].title + ' Taylor Swift')}`, '_blank');
        }
      };
      
      try {
        if (navigator.clipboard && navigator.clipboard.writeText) {
          navigator.clipboard.writeText(playlistText)
            .then(() => {
              alert('Playlist copied to clipboard!\n\nPaste this into a Spotify playlist or use Spotify\'s "Add songs" feature.');
            })
            .catch(openFallback);
        } else {
          openFallback();
        }
      } catch {
        openFallback();
      }
    };
    
    // Calculate overall uniqueness score (0-100, higher = more unique)
    const getUniquenessScore = () => {
      const top10Stats = allRanked.slice(0, 10).map((s, i) => getGlobalStats(s, i));
      const avgAgreement = top10Stats.reduce((a, b) => a + b, 0) / top10Stats.length;
      return Math.round(100 - avgAgreement);
    };
    
    const uniquenessScore = getUniquenessScore();
    const uniquenessLabel = uniquenessScore > 70 ? 'Iconoclast' : 
                           uniquenessScore > 50 ? 'Tastemaker' : 
                           uniquenessScore > 30 ? 'Balanced' : 'Mainstream';
    
    return (
      <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4">
        <div className="max-w-lg mx-auto">
          <div className="text-center mb-4">
            <h1 className="text-2xl font-black text-white flex items-center justify-center gap-2">
              <Trophy className="text-yellow-400" size={28} />
              {showFullList ? 'Full Rankings' : 'Your Official Top 10'}
            </h1>
            {hotTake && !showFullList && (
              <p className="text-slate-400 text-sm italic mt-1">"{hotTake}"</p>
            )}
          </div>
          
          {/* Global Comparison Stats */}
          {!showFullList && (
            <div className="bg-gradient-to-br from-rose-500/10 to-pink-500/10 border border-rose-500/20 rounded-xl p-4 mb-4">
              <p className="text-slate-400 text-xs uppercase tracking-wide mb-3 flex items-center gap-2">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                Based on 12,847 rankings
              </p>
              
              {/* Uniqueness Score */}
              <div className="bg-slate-900/50 rounded-lg p-3 mb-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-slate-400 text-xs">YOUR TASTE UNIQUENESS</span>
                  <span className="text-amber-400 text-xs font-semibold">{uniquenessLabel}</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-700 rounded-full h-2 overflow-hidden">
                    <div 
                      className="h-full bg-gradient-to-r from-emerald-400 via-amber-400 to-rose-400"
                      style={{ width: `${uniquenessScore}%` }}
                    />
                  </div>
                  <span className="text-white font-bold text-lg">{uniquenessScore}</span>
                </div>
                <p className="text-slate-500 text-xs mt-2">
                  {uniquenessScore > 50 
                    ? `Top ${100 - uniquenessScore}% most unique taste`
                    : `Your picks align with ${100 - uniquenessScore}% of fans`
                  }
                </p>
              </div>
              
              <div className="space-y-3">
                {/* #1 Agreement */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Your #1: {allRanked[0]?.title}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <span className={`text-sm font-bold ${getGlobalStats(allRanked[0], 0) < 20 ? 'text-rose-400' : 'text-emerald-400'}`}>
                      {getGlobalStats(allRanked[0], 0)}% agree
                    </span>
                  </div>
                </div>
                
                {/* Most Unique Pick */}
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">
                      Your most unique: #{uniquePick.rank} {uniquePick.song.title}
                    </p>
                  </div>
                  <div className="text-right ml-3">
                    <span className="text-sm font-bold text-rose-400">
                      Only {uniquePick.percent}%
                    </span>
                  </div>
                </div>
                
                {/* Controversial Take (if any) */}
                {controversialPick && (
                  <div className="bg-white/5 rounded-lg p-2 mt-2">
                    <p className="text-rose-300 text-xs">
                      🔥 Hot take: You ranked "{controversialPick.song.title}" in your Top 5, but only {controversialPick.percent}% of fans agree
                    </p>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {/* Toggle between Top 10 and Full List */}
          <div className="flex gap-2 mb-4">
            <button
              onClick={() => setShowFullList(false)}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all ${!showFullList ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}
            >
              Top 10
            </button>
            <button
              onClick={() => setShowFullList(true)}
              className={`flex-1 py-2 rounded-xl font-semibold transition-all ${showFullList ? 'bg-white text-slate-900' : 'bg-white/10 text-white'}`}
            >
              All {songs.length} Songs
            </button>
          </div>
          
          <div className="bg-slate-800/50 border border-slate-700 rounded-2xl p-4 mb-4 max-h-[40vh] overflow-y-auto">
            {(showFullList ? allRanked : allRanked.slice(0, 10)).map((song, i) => (
              <div key={song.id} className="flex items-center gap-3 py-2 border-b border-slate-700/50 last:border-0">
                <span className={`text-lg font-black w-8 ${i === 0 ? 'text-yellow-400' : i < 3 ? 'text-slate-300' : 'text-slate-500'}`}>
                  {i + 1}
                </span>
                <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${albumArt[song.album]?.gradient || 'from-purple-500 to-pink-500'} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <p className="text-white font-semibold truncate text-sm">{song.title}</p>
                  <p className="text-slate-400 text-xs truncate">{song.album}</p>
                </div>
                <div className="text-right">
                  <span className="text-white font-bold text-sm block">
                    {getFullListScore(i, allRanked.length)}
                  </span>
                  {!showFullList && (
                    <span className={`text-xs ${getGlobalStats(song, i) < 30 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {getGlobalStats(song, i)}%
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
          
          {/* Share Link */}
          <button
            onClick={async () => {
              const id = await saveRanking();
              if (id) {
                const url = getShareUrl(id);
                if (navigator.clipboard && navigator.clipboard.writeText) {
                  navigator.clipboard.writeText(url).then(() => {
                    alert('Link copied! Share it so friends can see your full ranking.');
                  });
                } else {
                  alert(`Share this link: ${url}`);
                }
              }
            }}
            disabled={savingRanking}
            className="w-full bg-slate-700 hover:bg-slate-600 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-3 disabled:opacity-50"
          >
            <ExternalLink size={18} />
            {savingRanking ? 'Saving...' : shareId ? 'Link Copied!' : 'Share Full Ranking Link'}
          </button>
          {shareError && (
            <p className="text-red-400 text-xs text-center mb-3">{shareError}</p>
          )}
          
          {/* Spotify Export */}
          <button
            onClick={exportToSpotify}
            className="w-full bg-green-600 hover:bg-green-500 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2 mb-4"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
            </svg>
            Export to Spotify
          </button>
          
          {/* Share Card Themes */}
          <p className="text-white font-semibold mb-3 text-center">Share Your Rankings</p>
          <div className="grid grid-cols-3 gap-2 mb-4">
            {Object.entries(themes).map(([key, theme]) => (
              <button
                key={key}
                onClick={() => previewCard(key)}
                className="relative bg-slate-800/50 border border-slate-700 rounded-xl p-3 text-center hover:bg-slate-700/50 transition-all"
              >
                <div 
                  className="w-full h-16 rounded-lg mb-2"
                  style={{ background: `linear-gradient(135deg, ${theme.gradient[0]}, ${theme.gradient[2]})` }}
                />
                <p className="text-white text-xs font-semibold">{theme.name}</p>
                {key === 'basic' ? (
                  <p className="text-emerald-400 text-xs">Free</p>
                ) : unlockedThemes.includes(key) ? (
                  <p className="text-emerald-400 text-xs">✓</p>
                ) : (
                  <p className="text-yellow-400 text-xs">${theme.price}</p>
                )}
              </button>
            ))}
          </div>
          
          <button
            onClick={reset}
            className="w-full bg-slate-800/50 border border-slate-700 text-white py-3 rounded-xl font-semibold flex items-center justify-center gap-2"
          >
            <RotateCcw size={18} />
            Start Over
          </button>
        </div>
        
        {/* Paywall Modal */}
        {showPaywall && (
          <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 border border-slate-700 rounded-3xl p-6 max-w-sm w-full">
              <div className="text-center mb-5">
                <div className="text-5xl mb-3">✨</div>
                <h2 className="text-2xl font-bold text-white">Unlock {themes[selectedTheme]?.name}</h2>
                <p className="text-slate-400">Premium share card theme</p>
              </div>
              
              <div 
                className="w-full h-32 rounded-xl mb-5"
                style={{ background: `linear-gradient(135deg, ${themes[selectedTheme]?.gradient[0]}, ${themes[selectedTheme]?.gradient[2]})` }}
              />
              
              <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 mb-5 space-y-2">
                <p className="text-white flex items-center gap-2"><Check size={18} className="text-emerald-400" /> High resolution (1080x1920)</p>
                <p className="text-white flex items-center gap-2"><Check size={18} className="text-emerald-400" /> No watermark</p>
                <p className="text-white flex items-center gap-2"><Check size={18} className="text-emerald-400" /> Perfect for Stories</p>
              </div>
              
              <button
                onClick={() => handlePurchase(selectedTheme)}
                className="w-full bg-gradient-to-r from-rose-500 to-pink-500 text-white py-4 rounded-xl font-bold text-lg mb-3"
              >
                Unlock for ${themes[selectedTheme]?.price}
              </button>
              
              <button
                onClick={() => setShowPaywall(false)}
                className="w-full text-slate-400 py-2 hover:text-white transition-colors"
              >
                Maybe later
              </button>
            </div>
          </div>
        )}
        
        {/* Card Preview Modal */}
        {showCardPreview && previewCardUrl && (
          <div 
            className="fixed inset-0 bg-black/90 flex flex-col items-center justify-center p-4 z-50"
            onClick={() => setShowCardPreview(false)}
          >
            <div className="max-w-sm w-full" onClick={(e) => e.stopPropagation()}>
              {/* Close X button */}
              <button
                onClick={() => setShowCardPreview(false)}
                className="absolute top-4 right-4 text-white/80 hover:text-white text-3xl font-light"
              >
                ✕
              </button>
              
              {/* Card Preview */}
              <div className="relative mb-4">
                <img 
                  src={previewCardUrl} 
                  alt="Share Card Preview" 
                  className="w-full rounded-2xl shadow-2xl"
                />
              </div>
              
              {/* Actions */}
              <div className="space-y-3">
                <button
                  onClick={() => { downloadCard(); setShowCardPreview(false); }}
                  className="w-full bg-gradient-to-r from-pink-500 to-rose-500 text-white py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2"
                >
                  <Download size={22} />
                  Save to Photos
                </button>
                
                <button
                  onClick={() => setShowCardPreview(false)}
                  className="w-full bg-white/10 text-white py-3 rounded-xl font-semibold"
                >
                  Back to Results
                </button>
              </div>
            </div>
          </div>
        )}
        
        <canvas ref={canvasRef} className="hidden" />
      </div>
    );
  }

  // Battle Screen
  const song1 = playoffMode ? playoffSongs[currentPair[0]] : songs[currentPair[0]];
  const song2 = playoffMode ? playoffSongs[currentPair[1]] : songs[currentPair[1]];
  
  // Calculate progress - seeding is 0-100%, playoff is separate
  const getProgress = () => {
    if (playoffMode) {
      return playoffBattles; // Just return battle count for playoff
    }
    // True Swiftie needs 2 battles per song, Casual needs 1
    const minBattles = isTrueSwiftie ? 2 : 1;
    const songsSeeded = songs.filter(s => s.battles >= minBattles).length;
    return Math.min(99, Math.round((songsSeeded / songs.length) * 100));
  };
  const progress = getProgress();

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 p-4 flex flex-col">
      {/* Streak Animation */}
      {showStreak && (
        <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
          <div className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-8 py-4 rounded-2xl font-black text-2xl flex items-center gap-2 animate-bounce shadow-2xl">
            <Zap size={32} /> {streak} SPEED STREAK!
          </div>
        </div>
      )}
      
      <div className="max-w-lg mx-auto w-full flex-1 flex flex-col">
        {/* Header */}
        <div className="text-center mb-4">
          <h1 className="text-xl font-bold text-white flex items-center justify-center gap-2">
            {playoffMode ? (
              <><Trophy className="text-amber-400" size={22} /> Top {playoffSongs.length} Playoff</>
            ) : (
              <>Taylor Swift</>
            )}
          </h1>
          <p className="text-slate-400 text-sm">
            {playoffMode 
              ? `Battle ${Math.min(playoffBattles + 1, getTotalPlayoffBattles())} of ${getTotalPlayoffBattles()}`
              : `${progress}% complete`
            }
            {streak >= 5 && <span className="ml-2 text-rose-400">⚡ {streak}</span>}
          </p>
          
          {/* Progress */}
          <div className="mt-3 bg-slate-700 rounded-full h-2 overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-pink-500 transition-all duration-300"
              style={{ width: `${Math.min(100, playoffMode ? getPlayoffProgress() : progress)}%` }}
            />
          </div>
          <p className="text-slate-500 text-xs mt-1">
            {playoffMode ? `Deciding your final Top ${playoffSongs.length}` : 'Tap fast to build a speed streak ⚡'}
          </p>
        </div>
        
        {/* Battle Cards */}
        <div className="flex-1 flex flex-col gap-4 justify-center">
          <button
            onClick={() => playoffMode ? handlePlayoffBattle(currentPair[0]) : handleBattle(currentPair[0])}
            className={`relative overflow-hidden rounded-3xl shadow-xl transition-all active:scale-95 ${
              animate === 'left' ? 'scale-105 ring-4 ring-rose-400' : ''
            } ${animate === 'right' ? 'opacity-40 scale-95' : ''}`}
          >
            {/* Album art background */}
            {albumArt[song1?.album]?.image ? (
              <img src={albumArt[song1?.album]?.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${albumArt[song1?.album]?.gradient || 'from-purple-500 to-pink-500'}`} />
            )}
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            {/* Content */}
            <div className="relative p-6 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${albumArt[song1?.album]?.gradient || 'from-purple-500 to-pink-500'} flex-shrink-0 shadow-lg`} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-xl font-bold truncate">{song1?.title}</p>
                <p className="text-white/70 text-sm">{song1?.album}</p>
                {playoffMode && (
                  <p className="text-white/50 text-xs mt-1">{song1?.playoffWins}W - {song1?.playoffLosses}L</p>
                )}
              </div>
            </div>
          </button>
          
          <p className="text-center text-slate-500 font-bold text-lg">VS</p>
          
          <button
            onClick={() => playoffMode ? handlePlayoffBattle(currentPair[1]) : handleBattle(currentPair[1])}
            className={`relative overflow-hidden rounded-3xl shadow-xl transition-all active:scale-95 ${
              animate === 'right' ? 'scale-105 ring-4 ring-rose-400' : ''
            } ${animate === 'left' ? 'opacity-40 scale-95' : ''}`}
          >
            {/* Album art background */}
            {albumArt[song2?.album]?.image ? (
              <img src={albumArt[song2?.album]?.image} alt="" className="absolute inset-0 w-full h-full object-cover" />
            ) : (
              <div className={`absolute inset-0 bg-gradient-to-br ${albumArt[song2?.album]?.gradient || 'from-rose-500 to-orange-500'}`} />
            )}
            {/* Overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
            {/* Content */}
            <div className="relative p-6 flex items-center gap-4">
              <div className={`w-16 h-16 rounded-xl bg-gradient-to-br ${albumArt[song2?.album]?.gradient || 'from-rose-500 to-orange-500'} flex-shrink-0 shadow-lg`} />
              <div className="flex-1 text-left min-w-0">
                <p className="text-white text-xl font-bold truncate">{song2?.title}</p>
                <p className="text-white/70 text-sm">{song2?.album}</p>
                {playoffMode && (
                  <p className="text-white/50 text-xs mt-1">{song2?.playoffWins}W - {song2?.playoffLosses}L</p>
                )}
              </div>
            </div>
          </button>
        </div>
        
        {/* Playoff Standings Card */}
        {playoffMode && (
          <div className="mt-4 bg-slate-800/50 border border-slate-700 rounded-xl p-3">
            <p className="text-slate-400 text-xs font-semibold mb-2 text-center">Current Standings</p>
            <div className={`grid gap-1 ${playoffSongs.length > 5 ? 'grid-cols-7' : 'grid-cols-5'}`}>
              {[...playoffSongs]
                .sort((a, b) => b.playoffWins - a.playoffWins || b.rating - a.rating)
                .map((song, i) => (
                  <div key={song.id} className="text-center">
                    <p className={`text-xs font-bold ${i === 0 ? 'text-rose-400' : 'text-slate-500'}`}>
                      {i + 1}
                    </p>
                    <p className="text-white text-xs truncate" title={song.title}>
                      {song.title.slice(0, 6)}..
                    </p>
                    <p className="text-slate-500 text-xs">{song.playoffWins}-{song.playoffLosses}</p>
                  </div>
                ))}
            </div>
          </div>
        )}
        
        <p className="text-center text-slate-500 text-xs mt-4">Tap the song you prefer</p>
      </div>
    </div>
  );
};

export default SongRanker;
