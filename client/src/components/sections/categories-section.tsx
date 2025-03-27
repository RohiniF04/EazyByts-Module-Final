import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Category } from "@shared/schema";
import CategoryCard from "@/components/ui/category-card";
import { Skeleton } from "@/components/ui/skeleton";

export default function CategoriesSection() {
  const { data: categories, isLoading, error } = useQuery<Category[]>({
    queryKey: ["/api/categories"],
  });

  if (error) {
    return (
      <div className="bg-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
          <div className="text-center py-8">
            <p className="text-red-500">Failed to load categories. Please try again later.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">Browse by Category</h2>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {isLoading ? (
            // Loading skeletons
            Array(6).fill(0).map((_, i) => (
              <div key={i} className="flex flex-col items-center p-4 border border-gray-200 rounded-lg">
                <Skeleton className="h-12 w-12 rounded-full mb-3" />
                <Skeleton className="h-4 w-20" />
              </div>
            ))
          ) : (
            // Render actual categories
            categories?.map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
