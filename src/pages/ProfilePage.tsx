import { useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPin, 
  Ruler, 
  Calendar, 
  Heart, 
  MessageSquare, 
  Share2,
  CheckCircle2,
  Globe,
  Instagram,
  Lock,
  Wallet,
  Send,
  Crown,
  ArrowLeft,
  Camera,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { useAuthStore, useFavoritesStore, useBalanceStore } from '@/store';
import { mockModels, mockAgencies, mockModelProfiles, mockAgencyProfiles, getUserById } from '@/data/mock';
import type { UserRole } from '@/types';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, uploadAvatar } = useAuthStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const { purchase } = useBalanceStore();
  
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [contactsRevealed, setContactsRevealed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get user data
  const user = id ? getUserById(id) : currentUser;
  const isOwnProfile = !id || id === currentUser?.id;

  const handleAvatarClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      const url = await uploadAvatar(file);
      setIsUploading(false);
      if (url) {
        // Success feedback if needed
      }
    }
  };
  
  if (!user) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">User not found</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const isModel = user.role === 'model';
  const profile = isModel 
    ? mockModelProfiles[user.id] 
    : mockAgencyProfiles[user.id];

  if (!profile) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Profile not found</h1>
        <Button onClick={() => navigate(-1)}>
          <ArrowLeft className="w-4 h-4 mr-2" />
          Go Back
        </Button>
      </div>
    );
  }

  const modelProfile = isModel ? profile as typeof mockModelProfiles[string] : null;
  const agencyProfile = !isModel ? profile as typeof mockAgencyProfiles[string] : null;

  const handleBuyContacts = async () => {
    const success = await purchase(3, `Open contacts - ${user.name}`);
    if (success) {
      setContactsRevealed(true);
      setShowContactDialog(false);
    }
  };

  const handleSendRequest = () => {
    setShowRequestDialog(true);
  };

  const photos = modelProfile?.photos || agencyProfile?.photos || [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 lg:h-80">
        <img
          src={photos[0]}
          alt={user.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
        
        {/* Back Button */}
        <Button
          variant="secondary"
          size="icon"
          className="absolute top-4 left-4 bg-white/90 hover:bg-white"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>

        {/* Action Buttons */}
        {!isOwnProfile && (
          <div className="absolute top-4 right-4 flex gap-2">
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
              onClick={() => isFavorite(user.id) ? removeFromFavorites(user.id) : addToFavorites(user.id)}
            >
              <Heart className={`w-5 h-5 ${isFavorite(user.id) ? 'fill-red-500 text-red-500' : ''}`} />
            </Button>
            <Button
              variant="secondary"
              size="icon"
              className="bg-white/90 hover:bg-white"
            >
              <Share2 className="w-5 h-5" />
            </Button>
          </div>
        )}

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto flex items-end gap-4">
            <div className="relative group">
              <Avatar 
                className={`w-24 h-24 lg:w-32 lg:h-32 border-4 border-white ${isOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={handleAvatarClick}
              >
                <AvatarImage src={user.avatarUrl || user.avatar} />
                <AvatarFallback className="text-3xl bg-amber-500 text-white">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              
              {isOwnProfile && (
                <div 
                  className="absolute inset-0 flex items-center justify-center bg-black/40 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                  onClick={handleAvatarClick}
                >
                  {isUploading ? (
                    <Loader2 className="w-8 h-8 text-white animate-spin" />
                  ) : (
                    <Camera className="w-8 h-8 text-white" />
                  )}
                </div>
              )}
              
              {isOwnProfile && (
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleFileChange}
                />
              )}
            </div>
            <div className="flex-1 text-white pb-2">
              <div className="flex items-center gap-2 mb-1">
                <h1 className="text-2xl lg:text-3xl font-bold">{user.name}</h1>
                {user.isVerified && (
                  <Badge className="bg-blue-500">
                    <CheckCircle2 className="w-3 h-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
              <div className="flex items-center gap-4 text-white/80">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {isModel ? modelProfile?.location : agencyProfile?.location}
                </div>
                {isModel && modelProfile && (
                  <>
                    <div className="flex items-center gap-1">
                      <Ruler className="w-4 h-4" />
                      {modelProfile.height} cm
                    </div>
                    <div className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {modelProfile.age} years
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* About */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">About</h2>
                <p className="text-gray-600 whitespace-pre-line">
                  {isModel ? modelProfile?.bio : agencyProfile?.description}
                </p>

                {isModel && modelProfile && (
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{modelProfile.height}</p>
                      <p className="text-xs text-gray-500">Height (cm)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{modelProfile.bust}-{modelProfile.waist}-{modelProfile.hips}</p>
                      <p className="text-xs text-gray-500">B-W-H</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{modelProfile.shoeSize}</p>
                      <p className="text-xs text-gray-500">Shoe (EU)</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{modelProfile.clothingSize}</p>
                      <p className="text-xs text-gray-500">Size</p>
                    </div>
                  </div>
                )}

                {!isModel && agencyProfile && (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{agencyProfile.representedModelsCount}</p>
                      <p className="text-xs text-gray-500">Models</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{agencyProfile.otherOffices.length + 1}</p>
                      <p className="text-xs text-gray-500">Offices</p>
                    </div>
                    <div className="text-center p-3 bg-gray-50 rounded-lg">
                      <p className="text-2xl font-bold text-gray-900">{agencyProfile.foundedYear}</p>
                      <p className="text-xs text-gray-500">Founded</p>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Photos */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">Portfolio</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {photos.map((photo, index) => (
                    <div 
                      key={index} 
                      className="aspect-[3/4] rounded-lg overflow-hidden cursor-pointer hover:opacity-90 transition-opacity"
                      onClick={() => setActivePhotoIndex(index)}
                    >
                      <img
                        src={photo}
                        alt={`${user.name} - ${index + 1}`}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Categories / Specializations */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-4">
                  {isModel ? 'Categories' : 'Specializations'}
                </h2>
                <div className="flex flex-wrap gap-2">
                  {(isModel ? modelProfile?.categories : agencyProfile?.specialization)?.map((item) => (
                    <Badge key={item} variant="secondary" className="text-sm px-3 py-1">
                      {item}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Languages */}
            {isModel && modelProfile?.languages && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Languages</h2>
                  <div className="flex flex-wrap gap-2">
                    {modelProfile.languages.map((lang) => (
                      <Badge key={lang} variant="outline" className="text-sm px-3 py-1">
                        {lang}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Column - Sidebar */}
          <div className="space-y-6">
            {/* Action Card */}
            {!isOwnProfile && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6 space-y-3">
                  <Button 
                    className="w-full bg-amber-500 hover:bg-amber-600"
                    onClick={handleSendRequest}
                  >
                    <Send className="w-4 h-4 mr-2" />
                    {currentUser?.role === 'model' ? 'Send Request' : 'Invite to Casting'}
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => setShowContactDialog(true)}
                  >
                    <Lock className="w-4 h-4 mr-2" />
                    Unlock Contacts ($3)
                  </Button>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate('/messages')}
                  >
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Send Message
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Contacts Card */}
            <Card className="border-0 shadow-sm">
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Contact Information</h3>
                
                {contactsRevealed || isOwnProfile ? (
                  <div className="space-y-3">
                    {isModel && modelProfile?.socialLinks.instagram && (
                      <a 
                        href={`https://instagram.com/${modelProfile.socialLinks.instagram.replace('@', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-amber-600"
                      >
                        <Instagram className="w-5 h-5" />
                        {modelProfile.socialLinks.instagram}
                      </a>
                    )}
                    {isModel && modelProfile?.socialLinks.website && (
                      <a 
                        href={`https://${modelProfile.socialLinks.website}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 text-gray-600 hover:text-amber-600"
                      >
                        <Globe className="w-5 h-5" />
                        {modelProfile.socialLinks.website}
                      </a>
                    )}
                    {!isModel && agencyProfile?.contacts && (
                      <>
                        {agencyProfile.contacts.phone && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Phone:</span>
                            {agencyProfile.contacts.phone}
                          </div>
                        )}
                        {agencyProfile.contacts.email && (
                          <div className="flex items-center gap-2 text-gray-600">
                            <span className="font-medium">Email:</span>
                            {agencyProfile.contacts.email}
                          </div>
                        )}
                        {agencyProfile.website && (
                          <a 
                            href={`https://${agencyProfile.website}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-2 text-gray-600 hover:text-amber-600"
                          >
                            <Globe className="w-5 h-5" />
                            {agencyProfile.website}
                          </a>
                        )}
                      </>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <Lock className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 text-sm mb-3">
                      Contacts are hidden. Unlock to view phone, email, and social media.
                    </p>
                    <Button 
                      size="sm" 
                      className="bg-amber-500 hover:bg-amber-600"
                      onClick={() => setShowContactDialog(true)}
                    >
                      <Wallet className="w-4 h-4 mr-2" />
                      Unlock for $3
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Subscription Card */}
            {user.subscriptionType !== 'free' && (
              <Card className="border-0 shadow-sm bg-gradient-to-br from-amber-500 to-orange-600 text-white">
                <CardContent className="p-6">
                  <div className="flex items-center gap-2 mb-2">
                    <Crown className="w-5 h-5" />
                    <span className="font-semibold">
                      {user.subscriptionType === 'model_plus' && 'Model Plus'}
                      {user.subscriptionType === 'agency_pro' && 'Agency Pro'}
                      {user.subscriptionType === 'premium' && 'Premium Member'}
                    </span>
                  </div>
                  <p className="text-sm text-white/80">
                    This user has a premium subscription
                  </p>
                </CardContent>
              </Card>
            )}

            {/* Status Card */}
            {isModel && modelProfile && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Status</h3>
                  <Badge 
                    className={`
                      ${modelProfile.status === 'looking' ? 'bg-green-500' : ''}
                      ${modelProfile.status === 'working' ? 'bg-blue-500' : ''}
                      ${modelProfile.status === 'not_looking' ? 'bg-gray-500' : ''}
                    `}
                  >
                    {modelProfile.status === 'looking' && 'Looking for agency'}
                    {modelProfile.status === 'working' && 'Currently working'}
                    {modelProfile.status === 'not_looking' && 'Not looking'}
                  </Badge>
                  {modelProfile.willingToRelocate && (
                    <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle2 className="w-4 h-4 text-green-500" />
                      Willing to relocate
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Requirements */}
            {!isModel && agencyProfile?.requirements && (
              <Card className="border-0 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-3">Requirements</h3>
                  <p className="text-gray-600 text-sm">
                    {agencyProfile.requirements}
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>

      {/* Contact Purchase Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Contact Information</DialogTitle>
            <DialogDescription>
              Get access to phone number, email, and social media links.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="p-4 bg-gray-50 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-gray-600">Service</span>
                <span className="font-medium">Open Contacts</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Price</span>
                <span className="text-xl font-bold text-amber-600">$3.00</span>
              </div>
            </div>
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowContactDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-amber-500 hover:bg-amber-600"
                onClick={handleBuyContacts}
              >
                <Wallet className="w-4 h-4 mr-2" />
                Pay $3
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {currentUser?.role === 'model' ? 'Send Request to Agency' : 'Invite to Casting'}
            </DialogTitle>
            <DialogDescription>
              {currentUser?.role === 'model' 
                ? 'Express your interest in joining this agency.'
                : 'Invite this model to your casting or event.'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <textarea
              className="w-full p-3 border rounded-lg resize-none"
              rows={4}
              placeholder="Write a message..."
            />
            <div className="flex gap-3">
              <Button 
                variant="outline" 
                className="flex-1"
                onClick={() => setShowRequestDialog(false)}
              >
                Cancel
              </Button>
              <Button 
                className="flex-1 bg-amber-500 hover:bg-amber-600"
                onClick={() => {
                  setShowRequestDialog(false);
                  // Send request logic
                }}
              >
                <Send className="w-4 h-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
