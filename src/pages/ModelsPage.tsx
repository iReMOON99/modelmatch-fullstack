import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  MapPin, 
  Ruler, 
  Calendar, 
  Heart, 
  Eye,
  Star,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Checkbox } from '@/components/ui/checkbox';
import { mockModels, mockModelProfiles } from '@/data/mock';
import type { ModelCategory, ModelFilters } from '@/types';

const categories: { value: ModelCategory; label: string }[] = [
  { value: 'fashion', label: 'Fashion' },
  { value: 'commercial', label: 'Commercial' },
  { value: 'runway', label: 'Runway' },
  { value: 'plus-size', label: 'Plus Size' },
  { value: 'fitness', label: 'Fitness' },
  { value: 'beauty', label: 'Beauty' },
  { value: 'editorial', label: 'Editorial' },
  { value: 'lingerie', label: 'Lingerie' },
  { value: 'parts', label: 'Parts' },
  { value: 'promo', label: 'Promo' },
];

export function ModelsPage() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<ModelFilters>({});
  const [selectedCategories, setSelectedCategories] = useState<ModelCategory[]>([]);
  const [heightRange, setHeightRange] = useState<[number, number]>([150, 200]);
  const [ageRange, setAgeRange] = useState<[number, number]>([16, 45]);

  const filteredModels = mockModels.filter((model) => {
    const profile = mockModelProfiles[model.id];
    if (!profile) return false;

    // Search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      const matchesName = model.name.toLowerCase().includes(query);
      const matchesLocation = profile.location.toLowerCase().includes(query);
      if (!matchesName && !matchesLocation) return false;
    }

    // Category filter
    if (selectedCategories.length > 0) {
      const hasCategory = selectedCategories.some(cat => 
        profile.categories.includes(cat)
      );
      if (!hasCategory) return false;
    }

    // Height filter
    if (profile.height < heightRange[0] || profile.height > heightRange[1]) {
      return false;
    }

    // Age filter
    if (profile.age < ageRange[0] || profile.age > ageRange[1]) {
      return false;
    }

    // Location filter
    if (filters.location && !profile.location.toLowerCase().includes(filters.location.toLowerCase())) {
      return false;
    }

    return true;
  });

  const toggleCategory = (category: ModelCategory) => {
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  const clearFilters = () => {
    setFilters({});
    setSelectedCategories([]);
    setHeightRange([150, 200]);
    setAgeRange([16, 45]);
  };

  return (
    <div className="p-4 lg:p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
          Browse Models
        </h1>
        <p className="text-gray-600">
          Discover talented models for your next project
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
          <Input
            placeholder="Search by name or location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          className="flex items-center gap-2"
        >
          <Filter className="w-4 h-4" />
          Filters
          {(selectedCategories.length > 0 || filters.location) && (
            <Badge variant="secondary" className="ml-1">
              {selectedCategories.length + (filters.location ? 1 : 0)}
            </Badge>
          )}
        </Button>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <Card className="mb-6 border-0 shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold">Filters</h3>
              <Button variant="ghost" size="sm" onClick={clearFilters}>
                <X className="w-4 h-4 mr-1" />
                Clear all
              </Button>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Categories */}
              <div>
                <label className="text-sm font-medium mb-2 block">Categories</label>
                <div className="space-y-2 max-h-40 overflow-y-auto">
                  {categories.map((cat) => (
                    <div key={cat.value} className="flex items-center gap-2">
                      <Checkbox
                        id={cat.value}
                        checked={selectedCategories.includes(cat.value)}
                        onCheckedChange={() => toggleCategory(cat.value)}
                      />
                      <label htmlFor={cat.value} className="text-sm cursor-pointer">
                        {cat.label}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Height Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Height: {heightRange[0]} - {heightRange[1]} cm
                </label>
                <Slider
                  value={heightRange}
                  onValueChange={(value) => setHeightRange(value as [number, number])}
                  min={150}
                  max={200}
                  step={1}
                  className="mt-4"
                />
              </div>

              {/* Age Range */}
              <div>
                <label className="text-sm font-medium mb-2 block">
                  Age: {ageRange[0]} - {ageRange[1]} years
                </label>
                <Slider
                  value={ageRange}
                  onValueChange={(value) => setAgeRange(value as [number, number])}
                  min={16}
                  max={45}
                  step={1}
                  className="mt-4"
                />
              </div>

              {/* Location */}
              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Input
                  placeholder="Enter city..."
                  value={filters.location || ''}
                  onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results Count */}
      <div className="flex items-center justify-between mb-4">
        <p className="text-gray-600">
          Showing <span className="font-semibold">{filteredModels.length}</span> models
        </p>
        <Select defaultValue="newest">
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest</SelectItem>
            <SelectItem value="popular">Most Popular</SelectItem>
            <SelectItem value="active">Most Active</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Models Grid */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredModels.map((model) => {
          const profile = mockModelProfiles[model.id];
          if (!profile) return null;

          return (
            <Card 
              key={model.id} 
              className="border-0 shadow-sm overflow-hidden cursor-pointer group hover:shadow-lg transition-shadow"
              onClick={() => navigate(`/profile/${model.id}`)}
            >
              {/* Cover Image */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <img
                  src={profile.photos[0]}
                  alt={model.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 right-3">
                  <Button 
                    variant="secondary" 
                    size="icon" 
                    className="w-8 h-8 bg-white/90 hover:bg-white"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Add to favorites
                    }}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                </div>
                {model.isVerified && (
                  <div className="absolute top-3 left-3">
                    <Badge className="bg-blue-500">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Verified
                    </Badge>
                  </div>
                )}
                {model.subscriptionType === 'premium' && (
                  <div className="absolute bottom-3 left-3">
                    <Badge className="bg-amber-500">
                      <Star className="w-3 h-3 mr-1 fill-white" />
                      Premium
                    </Badge>
                  </div>
                )}
              </div>

              {/* Info */}
              <CardContent className="p-4">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold text-lg">{model.name}</h3>
                    <div className="flex items-center gap-1 text-gray-500 text-sm">
                      <MapPin className="w-3 h-3" />
                      {profile.location}
                    </div>
                  </div>
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={model.avatarUrl} />
                    <AvatarFallback>{model.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                </div>

                <div className="flex items-center gap-4 mt-3 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Ruler className="w-4 h-4" />
                    {profile.height} cm
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {profile.age} years
                  </div>
                </div>

                <div className="flex flex-wrap gap-1 mt-3">
                  {profile.categories.slice(0, 3).map((cat) => (
                    <Badge key={cat} variant="secondary" className="text-xs">
                      {cat}
                    </Badge>
                  ))}
                  {profile.categories.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{profile.categories.length - 3}
                    </Badge>
                  )}
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t">
                  <div className="flex items-center gap-1 text-sm text-gray-500">
                    <Eye className="w-4 h-4" />
                    {Math.floor(Math.random() * 500 + 50)} views
                  </div>
                  <Button size="sm" className="bg-amber-500 hover:bg-amber-600">
                    View Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Empty State */}
      {filteredModels.length === 0 && (
        <div className="text-center py-16">
          <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No models found</h3>
          <p className="text-gray-500 mb-4">Try adjusting your filters or search query</p>
          <Button variant="outline" onClick={clearFilters}>
            Clear Filters
          </Button>
        </div>
      )}
    </div>
  );
}
