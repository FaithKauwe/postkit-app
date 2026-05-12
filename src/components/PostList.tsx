// useMemo is a React hook that remembers a computed value between renders and only recomputes when something important changes.
import { useMemo } from 'react'
import { usePostStore, type StatusFilter, type ListSortBy, type ListSortDirection } from '../store/usePostStore'
import { formatDate } from 'postkit-date-status-display'
import { readingTime, formatTime } from 'postkit-reading-time'
import { searchPosts } from 'postkit-search-library'
import { filterByStatus, filterByTag, sortByDate, sortByTitle } from 'postkit-filter-sort'
import type { Post } from '../types'

function PostList() {
  // Pull what we need from the store — no props needed!
  const posts = usePostStore((state) => state.posts)
  const searchQuery = usePostStore((state) => state.searchQuery)
  const setSearchQuery = usePostStore((state) => state.setSearchQuery)
  const statusFilter = usePostStore((state) => state.statusFilter)
  const setStatusFilter = usePostStore((state) => state.setStatusFilter)
  const tagFilter = usePostStore((state) => state.tagFilter)
  const setTagFilter = usePostStore((state) => state.setTagFilter)
  const sortBy = usePostStore((state) => state.sortBy)
  const setSortBy = usePostStore((state) => state.setSortBy)
  const sortDirection = usePostStore((state) => state.sortDirection)
  const setSortDirection = usePostStore((state) => state.setSortDirection)
  const selectedPostId = usePostStore((state) => state.selectedPostId)
  const setSelectedPostId = usePostStore((state) => state.setSelectedPostId)
  // part of tag suhggestions behavior, not part of requirements, but leaving for extra polish, the 
  // build an array of all unique tags used on all posts. useMemo allows this calculation to be redone minimally, 
  // only when "posts" changes
  const uniqueTagsFromPosts = useMemo(
    () => [...new Set(posts.flatMap((p) => p.tags))].sort(),
    [posts],
  )
  // use let so that we can reassign list as we travel down the condional branches
  // satisfying diff conditions will result in diff functions being applied to list, resultng in diff list objects being returned to user
  let list = searchPosts(posts, searchQuery)
  if (statusFilter !== 'all') {
    list = filterByStatus(list, statusFilter)
  }
  const tag = tagFilter.trim()
  if (tag !== '') {
    list = filterByTag(list, tag)
  }
  // the list always gets sorted, regardless of what the other consitional branches do
  // the only unknonwns are *how it gets sorted, based on the users choice
  list =
    sortBy === 'date'
      ? sortByDate(list, sortDirection)
  // this will be the alphabetical sort
      : sortByTitle(list, sortDirection)
  // visiblePosts is whatever is left after all the other consitional branches have been executed, if none of them are touched
  // it will just be the og list of posts
  const visiblePosts = list
  // render the seaerch query input box for the user
  // after introducing the search logic, posts gets replaced with visiblePosts.  If seearch query is empty, visiblePosts array that
  // gets mapped over is just the og posts array with no search filter applied
  const inputClass = 'mt-1 block w-full border border-yellow-700 rounded p-2 bg-stone-900 text-yellow-50 placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-sky-400'
  const labelClass = 'block mb-4'
  const labelTextClass = 'text-yellow-600 text-sm font-semibold uppercase tracking-wide'

  return (
    <section className="mb-8 p-5 rounded-lg border border-yellow-700" style={{ background: '#292524' }}>
      <h2 className="text-xl font-bold mb-4 !text-yellow-400 border-b border-yellow-800 pb-2">⚔️ Your Posts</h2>

      <label className={labelClass}>
        <span className={labelTextClass}>Search</span>
        <input
          type="search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Seek the Holy Grail of posts…"
          className={inputClass}
          aria-label="Search posts"
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Status</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as StatusFilter)}
          className={inputClass}
          aria-label="Filter by status"
        >
          <option value="all">All statuses</option>
          <option value="draft">Draft</option>
          <option value="review">Review</option>
          <option value="published">Published</option>
        </select>
      </label>
{/* datalist is a built in HTML feature. the browser decides how to show the options, I only provide the list of possible values, I don't write the filter for the suggestions */}
      <label className={labelClass}>
        <span className={labelTextClass}>Tag</span>
        <input
          type="text"
          list="post-tag-filter-options"
          value={tagFilter}
          onChange={(e) => setTagFilter(e.target.value)}
          placeholder="Elderberries, shrubbery, swallows carrying coconuts…"
          className={inputClass}
          aria-label="Filter by tag"
        />
        <datalist id="post-tag-filter-options">
          {uniqueTagsFromPosts.map((t) => (
            <option key={t} value={t} />
          ))}
        </datalist>
      </label>
{/* sorting controls */}
      <label className={labelClass}>
        <span className={labelTextClass}>Sort by</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as ListSortBy)}
          className={inputClass}
          aria-label="Sort by field"
        >
          <option value="date">Date created</option>
          <option value="title">Title</option>
        </select>
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Sort direction</span>
        <select
          value={sortDirection}
          onChange={(e) => setSortDirection(e.target.value as ListSortDirection)}
          className={inputClass}
          aria-label="Sort direction"
        >
          <option value="asc">
            {sortBy === 'date' ? 'Oldest first' : 'A–Z'}
          </option>
          <option value="desc">
            {sortBy === 'date' ? 'Newest first' : 'Z–A'}
          </option>
        </select>
      </label>

      <div className="space-y-3">
        {visiblePosts.length === 0 ? (
          <p className="text-stone-400 text-sm">
            {posts.length === 0 ? 'No posts yet.' : 'No posts match your search.'}
          </p>
        ) : (
          (visiblePosts as Post[]).map((post) => (
            <div
              key={post.id}
              onClick={() => setSelectedPostId(post.id)}
              className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                selectedPostId === post.id
                  ? 'border-sky-400 bg-sky-950'
                  : 'border-yellow-800 hover:border-yellow-600 hover:bg-stone-800'
              }`}
              style={{ background: selectedPostId === post.id ? '#0c2233' : '#1c1917' }}
            >
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-yellow-50">{post.title}</h3>
                <span className={`text-xs px-2 py-1 rounded font-medium ${
                  post.status === 'published'
                    ? 'bg-red-900 text-red-200 border border-red-700'
                    : post.status === 'review'
                      ? 'bg-yellow-900 text-yellow-200 border border-yellow-700'
                      : 'bg-stone-700 text-stone-300 border border-stone-500'
                }`}>
                  {post.status}
                </span>
              </div>
              <p className="text-sm text-sky-300 mt-1">by {post.author}</p>
              <p className="text-xs text-stone-400 mt-1">created {formatDate(post.createdAt)}</p>
              {post.status === 'published' ? (
                <p className="text-xs text-yellow-500 mt-1">
                  published {formatDate(post.publishedAt ?? post.updatedAt)}
                </p>
              ) : post.updatedAt !== post.createdAt ? (
                <p className="text-xs text-stone-400 mt-1">
                  updated {formatDate(post.updatedAt)}
                </p>
              ) : null}
              <p className="text-xs text-stone-500 mt-1">{formatTime(readingTime(post.body))} to read</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="text-xs bg-sky-900 text-sky-200 border border-sky-700 px-2 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  )
}

export default PostList
