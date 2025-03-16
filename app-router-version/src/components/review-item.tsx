import { ReviewData } from "@/types";
import style from "@/components/review-item.module.css"
import ReviewItemDeleteButton from "@/components/review-item-delete-button";

export default function ReviewItem({
    id,
    author,
    content,
    createdAt,
    bookId
}: ReviewData) {
  return (
    <div className={style.container}>
      <div className={style.author}>{author}</div>
      <div className={style.content}>{content}</div>
        <div className={style.bottom_container}>
            <div className={style.date}>
                {new Date(createdAt).toLocaleString()}
            </div>
            <div className={style.delete_btn}>
                <ReviewItemDeleteButton reviewId={id} bookId={bookId}/>
            </div>
        </div>
    </div>
  );
}