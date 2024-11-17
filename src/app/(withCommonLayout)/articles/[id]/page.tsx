import ArticleDetailsPage from "@/components/articles/ArticlesDetails";


function ArticlePage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <ArticleDetailsPage articleId={id} />
    </div>
  );
}

export default ArticlePage;
