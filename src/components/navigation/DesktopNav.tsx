
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Category } from "@/lib/types";

export const DesktopNav = () => {
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("position");

      if (error) throw error;
      return data as Category[];
    },
    staleTime: 0,
  });

  return (
    <div className="hidden md:flex items-center space-x-8">
      {categories?.map((category) => (
        <Link
          key={category.id}
          to={`/category/${category.id}`}
          className="text-gray-600 hover:text-primary transition-colors"
        >
          {category.name}
        </Link>
      ))}
    </div>
  );
};
