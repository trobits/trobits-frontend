import ArticleDetailsPage from "@/components/articles/ArticlesDetails";
import RecommendedArticles from "@/components/NewsPart/RecommendedAritcles";


function ArticlePage({ params: { id } }: { params: { id: string } }) {
  return (
    <div>
      <ArticleDetailsPage articleId={decodeURIComponent(id)} />
      <RecommendedArticles />
    </div>
  );
}

export default ArticlePage;
