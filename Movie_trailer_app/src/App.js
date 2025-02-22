import './App.css';
import { useState } from 'react';
import ReactPlayer from 'react-player';
import axios from 'axios';

function App() {
    const [video, setVideo] = useState("");
    const [videoList, setVideoList] = useState([]);
    const [pageHistory, setPageHistory] = useState([]); 
    const [error, setError] = useState(null);
    const [nextPageToken, setNextPageToken] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const API_KEY = "AIzaSyCPq240vMorvQpPN4qOlYFjrgGHkyQVLcE";

    async function fetchVideos(pageToken = "") {
        setIsLoading(true);
        try {
            const res = await axios.get("https://www.googleapis.com/youtube/v3/search", {
                params: {
                    part: "snippet",
                    q: `${video} trailer`,
                    key: API_KEY,
                    maxResults: 5,
                    pageToken: pageToken,
                }
            });

            if (res.data.items.length > 0) {
                const videos = res.data.items.map(item => {
                    if (!item.id || !item.id.videoId) {
                        return null;
                    }
                    return {
                        videoId: item.id.videoId,
                        title: item.snippet.title,
                        description: item.snippet.description,
                        thumbnail: item.snippet.thumbnails?.medium?.url,
                    };
                }).filter(Boolean);

                if (videos.length > 0) {
                    setPageHistory(prevHistory => [...prevHistory, { videos, nextPageToken: res.data.nextPageToken }]);
                    setVideoList(videos);
                    setNextPageToken(res.data.nextPageToken || "");
                    setError(null);
                } else {
                    setError("No valid trailers found.");
                    setVideoList([]);
                }
            } else {
                setError("Trailer not found. Try another movie.");
                setVideoList([]);
            }
        } catch (err) {
            console.error('Error fetching trailer:', err);
            setError("Error fetching trailer. Please try again.");
            setVideoList([]);
        } finally {
            setIsLoading(false);
        }
    }

    async function handleSearch() {
        if (!video.trim()) {
            setError("Please enter a movie name.");
            setVideoList([]);
            setPageHistory([]);
            setNextPageToken("");
            return;
        }
        fetchVideos();
    }

    function handleNextPage() {
        if (nextPageToken) {
            fetchVideos(nextPageToken);
        }
    }

    function handlePreviousPage() {
        if (pageHistory.length >= 1) {
            const previousPage = pageHistory[pageHistory.length - 2];
            setVideoList(previousPage.videos);
            setNextPageToken(previousPage.nextPageToken );
            setPageHistory(prevHistory => prevHistory.slice(0, -1)); 
        }
    }

    return (
        <>
            <div className="App">
                <h2 className='header'>Movie Trailer App</h2>

                <div className="search-box">
                    <label>Search Any Movies & Shows  </label>
                    <input
                        type="text"
                        value={video}
                        onChange={(e) => setVideo(e.target.value)}
                    />
                    <button onClick={handleSearch} disabled={isLoading}>
                        {isLoading ? "Searching..." : "Search"}
                    </button>
                </div>

                {error && <div style={{ color: 'red' }}>{error}</div>}

                {videoList.length > 0 && (
                    <div className="video-list">
                        {videoList.map((videoItem, index) => (
                            <div className="video-item" key={index}>
                                <div className="video-player">
                                    <ReactPlayer
                                        url={`https://www.youtube.com/watch?v=${videoItem.videoId}`}
                                        controls={true}
                                        width="100%"
                                        height="200px"
                                    />
                                </div>
                                <div className="video-details">
                                    <h3>{videoItem.title}</h3>
                                    <p>{videoItem.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {videoList.length > 0 && pageHistory.length > 1 && (
                    <div className="navigation-buttons">
                        <button className="previous-btn" onClick={handlePreviousPage} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Previous Videos"}
                        </button>
                    </div>
                )}

                {videoList.length > 0 && nextPageToken && (
                    <div className="navigation-buttons glyphicon glyphicon-heart">
                        <button className="next-btn" onClick={handleNextPage} disabled={isLoading}>
                            {isLoading ? "Loading..." : "Next Videos"}
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}

export default App;
