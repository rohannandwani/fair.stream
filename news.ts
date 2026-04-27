// News API Service for FairStream
// This service fetches real news from various sources
// API used: GNews API (free tier available at https://gnews.io/)

export interface NewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface NewsResponse {
  totalArticles: number;
  articles: NewsArticle[];
}

// Mock data for demonstration when no API key is available
const mockNews: NewsArticle[] = [
  {
    title: "Study Finds Social Media Algorithms Can Increase Political Polarization",
    description: "New research from Stanford University shows that recommendation algorithms on social media platforms can significantly increase political polarization among users.",
    content: "Full article content here...",
    url: "https://example.com/political-polarization",
    image: null,
    publishedAt: new Date().toISOString(),
    source: { name: "Stanford Internet Observatory", url: "https://example.com" }
  },
  {
    title: "Digital Literacy Programs Show Promise in Reducing Misinformation",
    description: "K-12 schools implementing digital literacy curricula see measurable improvements in students' ability to identify reliable sources.",
    content: "Full article content here...",
    url: "https://example.com/digital-literacy",
    image: null,
    publishedAt: new Date(Date.now() - 3600000).toISOString(),
    source: { name: "Education Week", url: "https://example.com" }
  },
  {
    title: "Tech Companies Face Pressure to Address Algorithmic Bias",
    description: "Regulators and advocacy groups are calling for greater transparency in how social media platforms curate content for users.",
    content: "Full article content here...",
    url: "https://example.com/algorithmic-bias",
    image: null,
    publishedAt: new Date(Date.now() - 7200000).toISOString(),
    source: { name: "Tech Policy Press", url: "https://example.com" }
  },
  {
    title: "New Framework for Evaluating News Source Credibility",
    description: "Journalism researchers propose a standardized method for assessing the reliability of online news sources.",
    content: "Full article content here...",
    url: "https://example.com/credibility-framework",
    image: null,
    publishedAt: new Date(Date.now() - 10800000).toISOString(),
    source: { name: "Harvard Kennedy School", url: "https://example.com" }
  },
  {
    title: "The Rise of Anti-Polarization Technology in Social Media",
    description: "Startups are developing new tools to help users break out of echo chambers and consume diverse perspectives.",
    content: "Full article content here...",
    url: "https://example.com/anti-polarization",
    image: null,
    publishedAt: new Date(Date.now() - 14400000).toISOString(),
    source: { name: "Wired", url: "https://example.com" }
  }
];

// GNews API configuration
// To use real data, sign up at https://gnews.io/ and get a free API key
const GNEWS_API_KEY = import.meta.env.VITE_GNEWS_API_KEY || '';
const GNEWS_BASE_URL = 'https://gnews.io/api/v4';

export async function fetchNews(topic: string = 'technology', lang: string = 'en'): Promise<NewsArticle[]> {
  // If no API key, return mock data
  if (!GNEWS_API_KEY) {
    console.log('No GNews API key found, using mock data');
    return mockNews;
  }

  try {
    const response = await fetch(
      `${GNEWS_BASE_URL}/top-headlines?topic=${topic}&lang=${lang}&max=10`,
      {
        headers: {
          'Authorization': `Bearer ${GNEWS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error fetching news:', error);
    return mockNews;
  }
}

export async function searchNews(query: string, lang: string = 'en'): Promise<NewsArticle[]> {
  if (!GNEWS_API_KEY) {
    console.log('No GNews API key found, using mock data');
    return mockNews.filter(article => 
      article.title.toLowerCase().includes(query.toLowerCase()) ||
      article.description.toLowerCase().includes(query.toLowerCase())
    );
  }

  try {
    const response = await fetch(
      `${GNEWS_BASE_URL}/search?q=${encodeURIComponent(query)}&lang=${lang}&max=10`,
      {
        headers: {
          'Authorization': `Bearer ${GNEWS_API_KEY}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: NewsResponse = await response.json();
    return data.articles;
  } catch (error) {
    console.error('Error searching news:', error);
    return mockNews;
  }
}

export function getBiasFromSource(sourceName: string): 'left' | 'center' | 'right' {
  // Map common news sources to their political bias
  const sourceBias: Record<string, 'left' | 'center' | 'right'> = {
    'CNN': 'left',
    'Fox News': 'right',
    'MSNBC': 'left',
    'New York Times': 'left',
    'Wall Street Journal': 'right',
    'Washington Post': 'left',
    'Reuters': 'center',
    'Associated Press': 'center',
    'BBC': 'center',
    'NPR': 'center',
    'Harvard Kennedy School': 'center',
    'Stanford Internet Observatory': 'center',
    'Pew Research Center': 'center',
    'MIT Media Lab': 'left',
    'Heritage Foundation': 'right',
    'Wired': 'left',
    'Tech Policy Press': 'left',
    'Education Week': 'center',
  };

  return sourceBias[sourceName] || 'center';
}

export function calculateNeutralityScore(sourceName: string): number {
  // Calculate a mock neutrality score based on source
  const scores: Record<string, number> = {
    'Reuters': 95,
    'Associated Press': 94,
    'BBC': 90,
    'NPR': 85,
    'Stanford Internet Observatory': 92,
    'Harvard Kennedy School': 91,
    'Pew Research Center': 88,
    'Wall Street Journal': 78,
    'New York Times': 75,
    'CNN': 72,
    'Fox News': 68,
    'MSNBC': 65,
    'Heritage Foundation': 70,
    'MIT Media Lab': 80,
  };

  return scores[sourceName] || 75;
}
