Answer these questions in writing:

What change does this requirement make to the Post type? add an attribute publishedAt
Which files in your app will need to change? PostList and Preview
Which boundaries from your lesson 9 map does this change cross?
Run your test suite right now. Which tests break immediately?
Which tests do you expect to break after you implement the change?
Write your answers down. These are your predictions. You will compare them against what actually happened.

Why optional (publishedAt?) actually works fine here — passing your extended Post[] into a function expecting the library's Post[] is safe because your type satisfies all the library's requirements. The library doesn't know or care about publishedAt, and it won't touch it. The returned Post[] will be typed as the library's Post, which means TypeScript will forget about publishedAt on the way out.
That last part is the real long-term risk. After calling filterByTag, the return type is the library's Post[], so you'd lose publishedAt from TypeScript's perspective this means:
const filteredPosts = filterByTag(visiblePosts, tag) 
// filteredPosts is typed as LibraryPost[], publishedAt is now unknown to TS
filteredPosts[0].publishedAt // TS error — even though the data is there at runtime
The clean fix is to cast the return value back to your type:
const tagOnClick = (tag: string) => {
    const filteredPosts = filterByTag(visiblePosts, tag) as Post[]
    setVisiblePosts(filteredPosts)
}