// Define the Elasticsearch hit type
interface ElasticsearchHitType {
  id: string;
  name: string;
  [key: string]: any;
}