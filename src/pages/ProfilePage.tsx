import { useState, useRef, useEffect } from 'react';
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
  Loader2,
  Edit2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { useAuthStore, useFavoritesStore, useBalanceStore, useProfileStore } from '@/store';
import type { UserRole, ModelProfile, AgencyProfile } from '@/types';

export function ProfilePage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: currentUser, uploadAvatar } = useAuthStore();
  const { 
    modelProfile: fetchedModelProfile, 
    agencyProfile: fetchedAgencyProfile, 
    fetchProfile, 
    updateProfile,
    isLoading: isProfileLoading,
    uploadPhotos
  } = useProfileStore();
  const { isFavorite, addToFavorites, removeFromFavorites } = useFavoritesStore();
  const { purchase } = useBalanceStore();
  
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [showRequestDialog, setShowRequestDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [contactsRevealed, setContactsRevealed] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photosInputRef = useRef<HTMLInputElement>(null);

  // Edit form state
  const [editData, setEditData] = useState<any>({});

  useEffect(() => {
    if (id) {
      fetchProfile(id);
    } else if (currentUser) {
      fetchProfile(currentUser.id);
    }
  }, [id, currentUser?.id]);

  const isOwnProfile = !id || id === currentUser?.id;
  const user = isOwnProfile ? currentUser : (fetchedModelProfile || fetchedAgencyProfile ? {
    id: id!,
    name: fetchedModelProfile?.name || fetchedAgencyProfile?.name || 'User',
    role: fetchedModelProfile ? 'model' : 'agency' as UserRole,
    avatar: '', // We'll use profile photos or avatarUrl if available
    isVerified: true,
  } : null);

  if (isProfileLoading && !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="w-8 h-8 animate-spin text-amber-500" />
      </div>
    );
  }

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
  const modelProfile = fetchedModelProfile;
  const agencyProfile = fetchedAgencyProfile;
  const profile = isModel ? modelProfile : agencyProfile;

  const handleAvatarClick = () => {
    if (isOwnProfile && fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsUploading(true);
      await uploadAvatar(file);
      setIsUploading(false);
    }
  };

  const handlePhotosChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setIsUploadingPhotos(true);
      await uploadPhotos(files);
      setIsUploadingPhotos(false);
    }
  };

  const handleEditClick = () => {
    if (isModel && modelProfile) {
      setEditData({
        name: user.name,
        modelProfile: { ...modelProfile }
      });
    } else if (!isModel && agencyProfile) {
      setEditData({
        name: user.name,
        agencyProfile: { ...agencyProfile }
      });
    }
    setShowEditDialog(true);
  };

  const handleSaveProfile = async () => {
    const success = await updateProfile(editData);
    if (success) {
      setShowEditDialog(false);
    }
  };

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

  const photos = profile?.photos || [];
  const displayAvatar = currentUser?.id === user.id ? currentUser.avatarUrl : (isModel ? modelProfile?.photos?.[0] : agencyProfile?.photos?.[0]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header Image */}
      <div className="relative h-64 lg:h-80 bg-gray-200">
        {photos.length > 0 ? (
          <img
            src={photos[0]}
            alt={user.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-amber-100">
            <Camera className="w-12 h-12 text-amber-300" />
          </div>
        )}
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
        <div className="absolute top-4 right-4 flex gap-2">
          {isOwnProfile ? (
            <Button
              variant="secondary"
              className="bg-white/90 hover:bg-white"
              onClick={handleEditClick}
            >
              <Edit2 className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
          ) : (
            <>
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
            </>
          )}
        </div>

        {/* Profile Info Overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-4 lg:p-8">
          <div className="max-w-6xl mx-auto flex items-end gap-4">
            <div className="relative group">
              <Avatar 
                className={`w-24 h-24 lg:w-32 lg:h-32 border-4 border-white ${isOwnProfile ? 'cursor-pointer' : ''}`}
                onClick={handleAvatarClick}
              >
                <AvatarImage src={displayAvatar} />
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
              <div className="flex items-center gap-4 text-sm lg:text-base text-gray-200">
                <span className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  {isModel ? modelProfile?.location : agencyProfile?.location || 'Location not set'}
                </span>
                {isModel && modelProfile?.age && (
                  <span className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    {modelProfile.age} years
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column: Details & Stats */}
          <div className="space-y-6">
            <Card>
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-4">About</h3>
                <p className="text-gray-600 text-sm leading-relaxed mb-6">
                  {isModel ? modelProfile?.bio : agencyProfile?.description || 'No bio available'}
                </p>
                
                <div className="space-y-4">
                  {isModel ? (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 flex items-center gap-2">
                          <Ruler className="w-4 h-4" /> Height
                        </span>
                        <span className="font-medium">{modelProfile?.height} cm</span>
                      </div>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 flex items-center gap-2">
                          <Crown className="w-4 h-4" /> Measurements
                        </span>
                        <span className="font-medium">
                          {modelProfile?.bust}-{modelProfile?.waist}-{modelProfile?.hips}
                        </span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex justify-between items-center py-2 border-b border-gray-100">
                        <span className="text-gray-500 flex items-center gap-2">
                          <Globe className="w-4 h-4" /> Website
                        </span>
                        <a href={agencyProfile?.website} className="text-amber-600 hover:underline">
                          {agencyProfile?.website || 'Not set'}
                        </a>
                      </div>
                    </>
                  )}
                </div>
              </CardContent>
            </Card>

            {!isOwnProfile && (
              <div className="flex flex-col gap-3">
                <Button 
                  size="lg" 
                  className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                  onClick={() => setShowContactDialog(true)}
                >
                  <MessageSquare className="w-4 h-4 mr-2" />
                  Show Contacts
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="w-full border-amber-500 text-amber-600 hover:bg-amber-50"
                  onClick={handleSendRequest}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send Request
                </Button>
              </div>
            )}
          </div>

          {/* Right Column: Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-bold text-xl">Portfolio</h3>
              {isOwnProfile && (
                <>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => photosInputRef.current?.click()}
                    disabled={isUploadingPhotos}
                  >
                    {isUploadingPhotos ? (
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <Camera className="w-4 h-4 mr-2" />
                    )}
                    Add Photos
                  </Button>
                  <input
                    type="file"
                    ref={photosInputRef}
                    className="hidden"
                    multiple
                    accept="image/*"
                    onChange={handlePhotosChange}
                  />
                </>
              )}
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {photos.map((photo, index) => (
                <div 
                  key={index} 
                  className="aspect-[3/4] rounded-xl overflow-hidden bg-gray-100 group relative"
                >
                  <img
                    src={photo}
                    alt={`Portfolio ${index + 1}`}
                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              ))}
              {photos.length === 0 && (
                <div className="col-span-full py-12 flex flex-col items-center justify-center bg-gray-100 rounded-xl border-2 border-dashed border-gray-300">
                  <Camera className="w-12 h-12 text-gray-400 mb-2" />
                  <p className="text-gray-500">No photos in portfolio yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Edit Profile Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Profile</DialogTitle>
            <DialogDescription>
              Update your profile information for others to see.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Name</Label>
              <Input 
                id="name" 
                value={editData.name || ''} 
                onChange={(e) => setEditData({ ...editData, name: e.target.value })}
              />
            </div>
            
            {isModel ? (
              <>
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="age">Age</Label>
                    <Input 
                      id="age" 
                      type="number"
                      value={editData.modelProfile?.age || ''} 
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        modelProfile: { ...editData.modelProfile, age: parseInt(e.target.value) } 
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="location">Location</Label>
                    <Input 
                      id="location" 
                      value={editData.modelProfile?.location || ''} 
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        modelProfile: { ...editData.modelProfile, location: e.target.value } 
                      })}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="height">Height (cm)</Label>
                    <Input 
                      id="height" 
                      type="number"
                      value={editData.modelProfile?.height || ''} 
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        modelProfile: { ...editData.modelProfile, height: parseInt(e.target.value) } 
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="bust">Bust</Label>
                    <Input 
                      id="bust" 
                      type="number"
                      value={editData.modelProfile?.bust || ''} 
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        modelProfile: { ...editData.modelProfile, bust: parseInt(e.target.value) } 
                      })}
                    />
                  </div>
                  <div className="grid gap-2">
                    <Label htmlFor="waist">Waist</Label>
                    <Input 
                      id="waist" 
                      type="number"
                      value={editData.modelProfile?.waist || ''} 
                      onChange={(e) => setEditData({ 
                        ...editData, 
                        modelProfile: { ...editData.modelProfile, waist: parseInt(e.target.value) } 
                      })}
                    />
                  </div>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    value={editData.modelProfile?.bio || ''} 
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      modelProfile: { ...editData.modelProfile, bio: e.target.value } 
                    })}
                  />
                </div>
              </>
            ) : (
              <>
                <div className="grid gap-2">
                  <Label htmlFor="location">Location</Label>
                  <Input 
                    id="location" 
                    value={editData.agencyProfile?.location || ''} 
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      agencyProfile: { ...editData.agencyProfile, location: e.target.value } 
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    value={editData.agencyProfile?.website || ''} 
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      agencyProfile: { ...editData.agencyProfile, website: e.target.value } 
                    })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    value={editData.agencyProfile?.description || ''} 
                    onChange={(e) => setEditData({ 
                      ...editData, 
                      agencyProfile: { ...editData.agencyProfile, description: e.target.value } 
                    })}
                  />
                </div>
              </>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>Cancel</Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={handleSaveProfile}
              disabled={isProfileLoading}
            >
              {isProfileLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Contact Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Contact Info</DialogTitle>
            <DialogDescription>
              To see contact information for {user.name}, you need to pay 3 tokens.
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center py-6">
            <div className="w-16 h-16 bg-amber-100 rounded-full flex items-center justify-center mb-4">
              <Wallet className="w-8 h-8 text-amber-600" />
            </div>
            <p className="text-center text-gray-600 mb-6">
              Current balance: <span className="font-bold text-gray-900">{currentUser?.balance || 0} tokens</span>
            </p>
            {contactsRevealed ? (
              <div className="w-full space-y-3 bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-gray-500">Phone:</span>
                  <span className="font-medium">+1 234 567 890</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Email:</span>
                  <span className="font-medium">{user.email}</span>
                </div>
              </div>
            ) : (
              <Button 
                className="w-full bg-amber-500 hover:bg-amber-600 text-white"
                onClick={handleBuyContacts}
              >
                Pay 3 tokens
              </Button>
            )}
          </div>
        </DialogContent>
      </Dialog>

      {/* Request Dialog */}
      <Dialog open={showRequestDialog} onOpenChange={setShowRequestDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Send Cooperation Request</DialogTitle>
            <DialogDescription>
              Write a short message to {user.name} about why you want to cooperate.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Textarea 
              placeholder="Tell them about your agency or your experience..."
              className="min-h-[150px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRequestDialog(false)}>Cancel</Button>
            <Button 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => setShowRequestDialog(false)}
            >
              Send Request
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
