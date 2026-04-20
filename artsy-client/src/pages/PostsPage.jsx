//this is for the posts page, can be accessed through nav bar "community" link

import { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faChevronUp } from "@fortawesome/free-solid-svg-icons";

import Header from "../components/layout/Header";
import Footer from "../components/layout/Footer";
import PostCard from "../components/posts/PostCard";
import NoisyPostCard from "../components/posts/NoisyPostCard";

import "../styles/pages/posts.css";

function PostsPage() {
    const [posts, setPosts] = useState([]);
    const [topReviewers, setTopReviewers] = useState([]);

    const [postsLoading, setPostsLoading] = useState(true);
    const [reviewersLoading, setReviewersLoading] = useState(true);

    const [postsError, setPostsError] = useState(null);
    const [reviewersError, setReviewersError] = useState(null);

    const [sortBy, setSortBy] = useState("Newest");
    const [mode, setMode] = useState(() => localStorage.getItem("postsMode") ?? "peace");

    function handleSetMode(m) {
        setMode(m);
        localStorage.setItem("postsMode", m);
    }

    const topReviewerLimit = 5;

    useEffect(() => {
        const statusMessages = {
            400: "Bad request.",
            401: "Please log in to continue.",
            403: "You don't have permission to view this.",
            404: "Not found.",
            500: "Server error, please try again later.",
        };

        const parseResponse = async (res) => {
            if (!res.ok) throw new Error(statusMessages[res.status] ?? `Unexpected error (${res.status}).`);
            return res.json();
        };

        async function fetchPosts() {
            try {
                const res = await fetch(`/ad-posts`);
                setPosts(await parseResponse(res));
            } catch (err) {
                setPostsError(err.message);
            } finally {
                setPostsLoading(false);
            }
        }

        async function fetchReviewers() {
            try {
                const res = await fetch(`/ad-users/top-reviewers?limit=${topReviewerLimit}`);
                setTopReviewers(await parseResponse(res));
            } catch (err) {
                setReviewersError(err.message);
            } finally {
                setReviewersLoading(false);
            }
        }

        fetchPosts();
        fetchReviewers();
    }, []);

    const sortedPosts = [...posts].sort((a, b) => {
        if (sortBy === "Popular")
            return b.likeCount + b.commentCount * 3 - (a.likeCount + a.commentCount * 3);
        const dateA = new Date(a.createdAt);
        const dateB = new Date(b.createdAt);
        return sortBy === "Newest" ? dateB - dateA : dateA - dateB;
    });

    const sortOptions = ["Newest", "Oldest", "Popular"];
    function toggleSort() {
        setSortBy((s) => sortOptions[(sortOptions.indexOf(s) + 1) % sortOptions.length]);
    }

    const isNoisy = mode === "noisy";

    return (
        <>
            <div className="home-header-overlay"><Header /></div>

            <div className={`container posts-page`} style={{ paddingTop: "120px" }}>

                <div className="posts-page__layout">

                    {/* ── Main column ── */}
                    <div>
                        <div className="posts-page__top-row">
                            <div className="posts-page__header-left">
                                <span className="posts-page__title">POPULAR REVIEWS</span>

                                {/* ── Mode toggle ── */}
                                <div className="posts-mode-bar">
                                    <button
                                        className={`posts-mode-btn ${!isNoisy ? "posts-mode-btn--active" : ""}`}
                                        onClick={() => handleSetMode("peace")}
                                    >
                                        Peaceful
                                    </button>
                                    <button
                                        className={`posts-mode-btn ${isNoisy ? "posts-mode-btn--active" : ""}`}
                                        onClick={() => handleSetMode("noisy")}
                                    >
                                        Noisy
                                    </button>
                                </div>
                            </div>

                            <button className="posts-page__sort-btn" onClick={toggleSort}>
                                Sort by {sortBy.toUpperCase()}
                                <FontAwesomeIcon icon={sortBy === "Oldest" ? faChevronUp : faChevronDown} />
                            </button>
                        </div>

                        {postsError ? (
                            <p className="posts-page__error">Error: {postsError}</p>
                        ) : postsLoading ? (
                            <p className="posts-page__loading">Loading…</p>
                        ) : sortedPosts.length === 0 ? (
                            <p className="posts-page__empty">No posts yet.</p>
                        ) : isNoisy ? (
                            <div className="posts-masonry">
                                {sortedPosts.map((post, i, arr) => {
                                    const wantsPoster = !!(post.posterUrl && post.postId % 2 === 0);
                                    const prevIsPoster = i > 0 && !!(arr[i - 1].posterUrl && arr[i - 1].postId % 2 === 0);
                                    const showPoster = wantsPoster && !prevIsPoster;
                                    return <NoisyPostCard key={post.postId} post={post} showPoster={showPoster} />;
                                })}
                            </div>
                        ) : (
                            <div className="posts-list">
                                {sortedPosts.map((post) => (
                                    <PostCard key={post.postId} post={post} />
                                ))}
                            </div>
                        )}
                    </div>

                    {/* ── Sidebar: popular reviewers ── */}
                    <aside className="posts-sidebar">
                        <div className="posts-sidebar__header">
                            <span className="posts-sidebar__title">Popular Reviewers</span>
                            <button className="posts-sidebar__more">More</button>
                        </div>

                        <div className="reviewer-list">
                            {reviewersError ? (
                                <p className="posts-page__error">Error: {reviewersError}</p>
                            ) : reviewersLoading ? (
                                <p className="posts-page__loading">Loading…</p>
                            ) : (
                                topReviewers.map(({ userName, reviewCount }, index) => (
                                    <Link key={userName} to={`/users/${userName}`} className="reviewer-item">
                                        <span className="reviewer-item__rank">{index + 1}</span>
                                        <div className="reviewer-item__avatar">
                                            {userName[0].toUpperCase()}
                                        </div>
                                        <div className="reviewer-item__info">
                                            <div className="reviewer-item__name">{userName}</div>
                                            <div className="reviewer-item__count">
                                                {reviewCount}{" "}{reviewCount === 1 ? "review" : "reviews"}
                                            </div>
                                        </div>
                                    </Link>
                                ))
                            )}
                        </div>
                    </aside>

                </div>
            </div>

            <Footer />
        </>
    );
}

export default PostsPage;
