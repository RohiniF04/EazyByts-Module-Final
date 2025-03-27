import { Link } from "wouter";
import { Category } from "@shared/schema";
import { 
  Music, 
  Film, 
  Utensils, 
  Zap, 
  BookOpen, 
  Briefcase, 
  Code, 
  Heart, 
  Camera, 
  Globe 
} from "lucide-react";

interface CategoryCardProps {
  category: Category;
}

export default function CategoryCard({ category }: CategoryCardProps) {
  // Map category icons to Lucide icons
  const getIcon = () => {
    switch (category.icon) {
      case 'music':
        return <Music className={`h-6 w-6 text-${category.color}-500`} />;
      case 'film':
        return <Film className={`h-6 w-6 text-${category.color}-500`} />;
      case 'utensils':
        return <Utensils className={`h-6 w-6 text-${category.color}-500`} />;
      case 'zap':
        return <Zap className={`h-6 w-6 text-${category.color}-500`} />;
      case 'book-open':
        return <BookOpen className={`h-6 w-6 text-${category.color}-500`} />;
      case 'briefcase':
        return <Briefcase className={`h-6 w-6 text-${category.color}-500`} />;
      case 'code':
        return <Code className={`h-6 w-6 text-${category.color}-500`} />;
      case 'heart':
        return <Heart className={`h-6 w-6 text-${category.color}-500`} />;
      case 'camera':
        return <Camera className={`h-6 w-6 text-${category.color}-500`} />;
      case 'globe':
        return <Globe className={`h-6 w-6 text-${category.color}-500`} />;
      default:
        return <Globe className={`h-6 w-6 text-${category.color}-500`} />;
    }
  };

  return (
    <Link href={`/events?category=${category.id}`}>
      <div className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
        <div className={`bg-${category.color}-100 p-3 rounded-full mb-3`}>
          {getIcon()}
        </div>
        <span className="text-sm font-medium text-gray-900">{category.name}</span>
      </div>
    </Link>
  );
}
