import { faBookmark, faComment, faEllipsisH, faHeart, faShare, faStar } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React from 'react'

const PostArticle = ({style,post}) => {
  return (
            <article key={post.id} className={style.postCard}>
              {/* Post Blob Background */}
              <div className={style.postBlob}></div>

              {/* Post Header */}
              <div className={style.postHeader}>
                <div className={style.authorInfo}>
                  <img
                    loading={"lazy"}
                    src={post.author.avatar}
                    alt={post.author.name}
                    className={style.authorAvatar}
                  />
                  <div className={style.authorDetails}>
                    <div className={style.authorName}>
                      {post.author.name}
                      {post.author.verified && (
                        <FontAwesomeIcon
                          icon={faStar}
                          className={style.verifiedIcon}
                        />
                      )}
                    </div>
                    <div className={style.authorRole}>{post.author.role}</div>
                    <div className={style.postTime}>{post.timeAgo}</div>
                  </div>
                </div>
                <div className={style.postActions}>
                  <button className={style.actionButton}>
                    <FontAwesomeIcon icon={faEllipsisH} />
                  </button>
                </div>
              </div>

              {/* Post Content */}
              <div className={style.postContent}>
                <p className={style.postText}>{post.content}</p>
                {post.image && (
                  <div className={style.postImageContainer}>
                    <img
                      loading={"lazy"}
                      src={post.image}
                      alt="Post"
                      className={style.postImage}
                    />
                  </div>
                )}
              </div>

              {/* Post Tags */}
              <div className={style.postTags}>
                {post.tags.map((tag, index) => (
                  <span key={index} className={style.tag}>
                    {tag}
                  </span>
                ))}
              </div>

              {/* Post Actions */}
              <div className={style.postActionsBar}>
                <button
                  className={`${style.actionButton} ${
                    post.isLiked ? style.liked : ""
                  }`}
                //   onClick={() => handleLike(post.id)}
                >
                  <FontAwesomeIcon icon={faHeart} />
                  <span>{post.likes}</span>
                </button>
                <button className={style.actionButton}>
                  <FontAwesomeIcon icon={faComment} />
                  <span>{post.comments}</span>
                </button>
                <button
                  className={style.actionButton}
                //   onClick={() => handleShare(post.id)}
                >
                  <FontAwesomeIcon icon={faShare} />
                  <span>{post.shares}</span>
                </button>
                <button
                  className={`${style.actionButton} ${
                    post.isBookmarked ? style.bookmarked : ""
                  }`}
                //   onClick={() => handleBookmark(post.id)}
                >
                  <FontAwesomeIcon icon={faBookmark} />
                </button>
              </div>
            </article>
  )
}

export default React.memo(PostArticle)
