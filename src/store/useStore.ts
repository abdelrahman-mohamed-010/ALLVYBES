import { create } from 'zustand';
import { User, Event, CheckIn, Message, Notification, Platform } from '../types';

interface AppState {
  // Theme
  darkMode: boolean;
  toggleDarkMode: () => void;

  // User (legacy - now using auth store)
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  
  // Events
  currentEvent: Event | null;
  setCurrentEvent: (event: Event | null) => void;
  events: Event[];
  addEvent: (event: Event) => void;
  updateEvent: (id: string, updates: Partial<Event>) => void;
  deleteEvent: (id: string) => void;
  
  // Check-ins
  checkIns: CheckIn[];
  addCheckIn: (checkIn: CheckIn) => void;
  updateCheckIn: (id: string, updates: Partial<CheckIn>) => void;
  
  // Users
  users: User[];
  addUser: (user: User) => void;
  updateUser: (id: string, updates: Partial<User>) => void;
  
  // Messages
  messages: Message[];
  addMessage: (message: Message) => void;
  markMessageAsRead: (id: string) => void;
  
  // Notifications
  notifications: Notification[];
  addNotification: (notification: Notification) => void;
  markNotificationAsRead: (id: string) => void;
  
  // Platforms
  platforms: Platform[];
  setPlatforms: (platforms: Platform[]) => void;
}

export const useStore = create<AppState>((set, get) => ({
  // Theme
  darkMode: false,
  toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

  // User (legacy - keeping for backward compatibility)
  currentUser: {
    id: 'admin-1',
    artistName: 'DJ VYBE',
    bio: 'Event organizer and music curator bringing the best vibes to Orlando',
    instagram: 'djvybe',
    profileImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
    isAdmin: true,
    createdAt: new Date(),
  },
  setCurrentUser: (user) => set({ currentUser: user }),

  // Events
  currentEvent: {
    id: '1',
    name: 'ORLANDO CYPHER LIVE',
    description: 'The hottest hip-hop cypher in Central Florida. Come showcase your skills and connect with the community.',
    date: new Date(Date.now() - 2 * 60 * 60 * 1000), // Started 2 hours ago
    endDate: new Date(Date.now() + 2 * 60 * 60 * 1000), // Ends in 2 hours
    location: 'Downtown Orlando',
    venue: 'The Underground',
    qrId: 'orlando-cypher-2024',
    isActive: true,
    isLive: true,
    capacity: 150,
    checkedInCount: 10,
    image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
    tags: ['Hip-Hop', 'Cypher', 'Live', 'Underground'],
    price: 15,
    createdAt: new Date(),
  },
  setCurrentEvent: (event) => set({ currentEvent: event }),

  events: [
    {
      id: '1',
      name: 'ORLANDO CYPHER LIVE',
      description: 'The hottest hip-hop cypher in Central Florida. Come showcase your skills and connect with the community.',
      date: new Date(Date.now() - 2 * 60 * 60 * 1000),
      endDate: new Date(Date.now() + 2 * 60 * 60 * 1000),
      location: 'Downtown Orlando',
      venue: 'The Underground',
      qrId: 'orlando-cypher-2024',
      isActive: true,
      isLive: true,
      capacity: 150,
      checkedInCount: 10,
      image: 'https://images.pexels.com/photos/1763075/pexels-photo-1763075.jpeg',
      tags: ['Hip-Hop', 'Cypher', 'Live', 'Underground'],
      price: 15,
      createdAt: new Date(),
    },
    {
      id: '2',
      name: 'MIAMI BASS COLLECTIVE',
      description: 'Electronic music showcase featuring the best bass artists from South Florida.',
      date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // Next week
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000 + 6 * 60 * 60 * 1000),
      location: 'Miami Beach',
      venue: 'Warehouse 305',
      qrId: 'miami-bass-2024',
      isActive: false,
      isLive: false,
      capacity: 300,
      checkedInCount: 0,
      image: 'https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg',
      tags: ['Electronic', 'Bass', 'Miami', 'Warehouse'],
      price: 25,
      createdAt: new Date(),
    },
    {
      id: '3',
      name: 'TAMPA R&B SESSIONS',
      description: 'Smooth R&B vibes with live performances and open mic opportunities.',
      date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // Two weeks
      endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000 + 5 * 60 * 60 * 1000),
      location: 'Tampa Bay',
      venue: 'Soul Kitchen',
      qrId: 'tampa-rnb-2024',
      isActive: false,
      isLive: false,
      capacity: 100,
      checkedInCount: 0,
      image: 'https://images.pexels.com/photos/1105666/pexels-photo-1105666.jpeg',
      tags: ['R&B', 'Soul', 'Live', 'Open Mic'],
      price: 20,
      createdAt: new Date(),
    },
    {
      id: '4',
      name: 'JACKSONVILLE INDIE NIGHT',
      description: 'Discover emerging indie artists and alternative sounds from North Florida.',
      date: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000), // Three weeks
      endDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000 + 4 * 60 * 60 * 1000),
      location: 'Jacksonville',
      venue: 'The Indie Spot',
      qrId: 'jax-indie-2024',
      isActive: false,
      isLive: false,
      capacity: 80,
      checkedInCount: 0,
      image: 'https://images.pexels.com/photos/1540406/pexels-photo-1540406.jpeg',
      tags: ['Indie', 'Alternative', 'Emerging', 'Discovery'],
      price: 12,
      createdAt: new Date(),
    },
  ],
  addEvent: (event) => set((state) => ({ events: [...state.events, event] })),
  updateEvent: (id, updates) => set((state) => ({
    events: state.events.map(event => 
      event.id === id ? { ...event, ...updates } : event
    )
  })),
  deleteEvent: (id) => set((state) => ({
    events: state.events.filter(event => event.id !== id)
  })),

  // Check-ins - 10 artists for Orlando Cypher Live
  checkIns: [
    {
      id: 'checkin-1',
      userId: 'user-1',
      eventId: '1',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      guestCount: 6,
      songCount: 2,
      isComplete: true,
      isStar: true, // 6 guests = star
      performed: true,
      specialEffects: true,
      otherContent: 'Also doing freestyle battle',
    },
    {
      id: 'checkin-2',
      userId: 'user-2',
      eventId: '1',
      timestamp: new Date(Date.now() - 1.8 * 60 * 60 * 1000),
      guestCount: 3,
      songCount: 1,
      isComplete: true,
      isStar: false,
      performed: false,
      specialEffects: false,
      otherContent: 'Bringing live drummer',
    },
    {
      id: 'checkin-3',
      userId: 'user-3',
      eventId: '1',
      timestamp: new Date(Date.now() - 1.6 * 60 * 60 * 1000),
      guestCount: 8,
      songCount: 3,
      isComplete: true,
      isStar: true, // 8 guests = star
      performed: false,
      specialEffects: true,
      otherContent: 'Cypher host and MC',
    },
    {
      id: 'checkin-4',
      userId: 'user-4',
      eventId: '1',
      timestamp: new Date(Date.now() - 1.4 * 60 * 60 * 1000),
      guestCount: 2,
      songCount: 2,
      isComplete: false,
      isStar: false,
      performed: false,
      specialEffects: false,
      otherContent: 'First time performer',
    },
    {
      id: 'checkin-5',
      userId: 'user-5',
      eventId: '1',
      timestamp: new Date(Date.now() - 1.2 * 60 * 60 * 1000),
      guestCount: 5,
      songCount: 1,
      isComplete: true,
      isStar: true, // 5 guests = star
      performed: false,
      specialEffects: true,
      otherContent: 'Live beatboxing performance',
    },
    {
      id: 'checkin-6',
      userId: 'user-6',
      eventId: '1',
      timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
      guestCount: 1,
      songCount: 2,
      isComplete: true,
      isStar: false,
      performed: false,
      specialEffects: false,
      otherContent: 'Acoustic hip-hop set',
    },
    {
      id: 'checkin-7',
      userId: 'user-7',
      eventId: '1',
      timestamp: new Date(Date.now() - 50 * 60 * 1000),
      guestCount: 4,
      songCount: 1,
      isComplete: true,
      isStar: true, // 4 guests = star
      performed: false,
      specialEffects: false,
      otherContent: 'Bringing backup dancers',
    },
    {
      id: 'checkin-8',
      userId: 'user-8',
      eventId: '1',
      timestamp: new Date(Date.now() - 40 * 60 * 1000),
      guestCount: 7,
      songCount: 2,
      isComplete: true,
      isStar: true, // 7 guests = star
      performed: false,
      specialEffects: true,
      otherContent: 'DJ set + live vocals',
    },
    {
      id: 'checkin-9',
      userId: 'user-9',
      eventId: '1',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      guestCount: 3,
      songCount: 3,
      isComplete: false,
      isStar: false,
      performed: false,
      specialEffects: false,
      otherContent: 'Poetry and spoken word',
    },
    {
      id: 'checkin-10',
      userId: 'user-10',
      eventId: '1',
      timestamp: new Date(Date.now() - 20 * 60 * 1000),
      guestCount: 9,
      songCount: 1,
      isComplete: true,
      isStar: true, // 9 guests = star
      performed: false,
      specialEffects: true,
      otherContent: 'Live band performance',
    },
  ],
  addCheckIn: (checkIn) => set((state) => ({ checkIns: [...state.checkIns, checkIn] })),
  updateCheckIn: (id, updates) => set((state) => ({
    checkIns: state.checkIns.map(checkIn => 
      checkIn.id === id ? { ...checkIn, ...updates } : checkIn
    )
  })),

  // Users - 10 diverse artists
  users: [
    {
      id: 'user-1',
      artistName: 'MC FLOW',
      bio: 'Orlando-based rapper with a passion for storytelling through music. Known for intricate wordplay and conscious lyrics.',
      instagram: 'mcflow_official',
      tiktok: 'mcflow_official',
      youtube: 'mcflowmusic',
      profileImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      phone: '(407) 555-0101',
      email: 'mcflow@email.com',
      emergencyContact: 'Sarah Flow - (407) 555-0102',
      createdAt: new Date(),
    },
    {
      id: 'user-2',
      artistName: 'LUNA BEATS',
      bio: 'Producer and DJ specializing in atmospheric hip-hop and R&B. Creating soundscapes that move souls.',
      instagram: 'lunabeats',
      youtube: 'lunabeatsmusic',
      twitter: 'lunabeats_',
      profileImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg',
      phone: '(407) 555-0201',
      email: 'luna@lunabeats.com',
      emergencyContact: 'Marcus Luna - (407) 555-0202',
      createdAt: new Date(),
    },
    {
      id: 'user-3',
      artistName: 'VERSE KING',
      bio: 'Freestyle champion and cypher veteran from Central Florida. 3x Orlando Battle Champion.',
      instagram: 'verseking407',
      twitter: 'verseking407',
      tiktok: 'verseking_official',
      profileImage: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg',
      phone: '(407) 555-0301',
      email: 'king@verseking.com',
      emergencyContact: 'Diana King - (407) 555-0302',
      createdAt: new Date(),
    },
    {
      id: 'user-4',
      artistName: 'RHYTHM SOUL',
      bio: 'Singer-songwriter blending R&B with modern hip-hop influences. Smooth vocals with powerful messages.',
      instagram: 'rhythmsoul_music',
      youtube: 'rhythmsoulofficial',
      twitchEmbed: 'https://player.twitch.tv/?channel=rhythmsoul&parent=localhost',
      profileImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      phone: '(407) 555-0401',
      email: 'rhythm@soulmusic.com',
      emergencyContact: 'James Soul - (407) 555-0402',
      createdAt: new Date(),
    },
    {
      id: 'user-5',
      artistName: 'BEATBOX PHOENIX',
      bio: 'Human beatbox extraordinaire. Creating full orchestras with just my voice and passion.',
      instagram: 'beatboxphoenix',
      tiktok: 'beatboxphoenix_',
      youtube: 'phoenixbeats',
      profileImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg',
      phone: '(407) 555-0501',
      email: 'phoenix@beatbox.com',
      emergencyContact: 'Lisa Phoenix - (407) 555-0502',
      createdAt: new Date(),
    },
    {
      id: 'user-6',
      artistName: 'ACOUSTIC REBEL',
      bio: 'Bringing raw hip-hop back to its roots with acoustic guitar and honest lyrics.',
      instagram: 'acousticrebel_',
      youtube: 'acousticrebelmusic',
      twitter: 'acoustic_rebel',
      profileImage: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg',
      phone: '(407) 555-0601',
      email: 'rebel@acoustic.com',
      emergencyContact: 'Mike Rebel - (407) 555-0602',
      createdAt: new Date(),
    },
    {
      id: 'user-7',
      artistName: 'DANCE COMMANDER',
      bio: 'High-energy performer bringing choreography and hip-hop together. Movement is my language.',
      instagram: 'dancecommander',
      tiktok: 'dancecommander_',
      youtube: 'commanderdance',
      profileImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      phone: '(407) 555-0701',
      email: 'commander@dance.com',
      emergencyContact: 'Alex Commander - (407) 555-0702',
      createdAt: new Date(),
    },
    {
      id: 'user-8',
      artistName: 'DJ VOLTAGE',
      bio: 'Turntable wizard and live vocal performer. Mixing classic breaks with modern flows.',
      instagram: 'djvoltage_',
      youtube: 'voltagebeats',
      twitter: 'dj_voltage',
      twitchEmbed: 'https://player.twitch.tv/?channel=djvoltage&parent=localhost',
      profileImage: 'https://images.pexels.com/photos/1587927/pexels-photo-1587927.jpeg',
      phone: '(407) 555-0801',
      email: 'voltage@djvoltage.com',
      emergencyContact: 'Sam Voltage - (407) 555-0802',
      createdAt: new Date(),
    },
    {
      id: 'user-9',
      artistName: 'SPOKEN TRUTH',
      bio: 'Poet and spoken word artist bridging the gap between literature and hip-hop culture.',
      instagram: 'spokentruth_',
      youtube: 'spokentruthpoetry',
      twitter: 'spoken_truth',
      profileImage: 'https://images.pexels.com/photos/1644888/pexels-photo-1644888.jpeg',
      phone: '(407) 555-0901',
      email: 'truth@spoken.com',
      emergencyContact: 'Maya Truth - (407) 555-0902',
      createdAt: new Date(),
    },
    {
      id: 'user-10',
      artistName: 'LIVE WIRE COLLECTIVE',
      bio: 'Full live band bringing hip-hop to life with real instruments. Bass, drums, keys, and bars.',
      instagram: 'livewire_collective',
      youtube: 'livewirecollective',
      twitter: 'livewire_music',
      profileImage: 'https://images.pexels.com/photos/1699161/pexels-photo-1699161.jpeg',
      phone: '(407) 555-1001',
      email: 'collective@livewire.com',
      emergencyContact: 'Tony Wire - (407) 555-1002',
      createdAt: new Date(),
    },
  ],
  addUser: (user) => set((state) => ({ users: [...state.users, user] })),
  updateUser: (id, updates) => set((state) => ({
    users: state.users.map(user => 
      user.id === id ? { ...user, ...updates } : user
    )
  })),

  // Messages - Active conversations
  messages: [
    {
      id: 'msg-1',
      senderId: 'user-2',
      receiverId: 'admin-1',
      content: 'Hey DJ VYBE! When do you think I\'ll be up? I\'ve got my drummer ready to go!',
      timestamp: new Date(Date.now() - 30 * 60 * 1000),
      read: false,
    },
    {
      id: 'msg-2',
      senderId: 'admin-1',
      receiverId: 'user-2',
      content: 'LUNA BEATS! You\'re up next after VERSE KING finishes. About 10 minutes! 🎤',
      timestamp: new Date(Date.now() - 25 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-3',
      senderId: 'user-3',
      receiverId: 'user-5',
      content: 'Yo PHOENIX! Your beatbox skills are insane. Want to collab on a freestyle?',
      timestamp: new Date(Date.now() - 15 * 60 * 1000),
      read: false,
    },
    {
      id: 'msg-4',
      senderId: 'user-5',
      receiverId: 'user-3',
      content: 'VERSE KING! Absolutely! Let\'s create some magic together 🔥',
      timestamp: new Date(Date.now() - 10 * 60 * 1000),
      read: true,
    },
    {
      id: 'msg-5',
      senderId: 'user-8',
      receiverId: 'admin-1',
      content: 'DJ VYBE, my setup is ready. Need any specific BPM for the next set?',
      timestamp: new Date(Date.now() - 8 * 60 * 1000),
      read: false,
    },
    {
      id: 'msg-6',
      senderId: 'user-10',
      receiverId: 'user-4',
      content: 'RHYTHM SOUL, our band would love to back you up on a track if you\'re interested!',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
    },
  ],
  addMessage: (message) => set((state) => ({ messages: [...state.messages, message] })),
  markMessageAsRead: (id) => set((state) => ({
    messages: state.messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    )
  })),

  // Notifications - Performance alerts
  notifications: [
    {
      id: 'notif-1',
      userId: 'user-2',
      content: 'LUNA BEATS, please come to the DJ booth - it\'s your time to perform! 🎤',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      read: false,
      type: 'performance',
    },
    {
      id: 'notif-2',
      userId: 'user-3',
      content: 'VERSE KING, you\'re up in 5 minutes! Get ready to showcase those freestyle skills 🔥',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      read: false,
      type: 'performance',
    },
    {
      id: 'notif-3',
      userId: 'user-5',
      content: 'BEATBOX PHOENIX, you\'re in the queue! Prepare for your beatbox showcase 🎵',
      timestamp: new Date(Date.now() - 2 * 60 * 1000),
      read: false,
      type: 'performance',
    },
    {
      id: 'notif-4',
      userId: 'user-8',
      content: 'DJ VOLTAGE, sound check complete! You\'re ready for your DJ set 🎧',
      timestamp: new Date(Date.now() - 1 * 60 * 1000),
      read: false,
      type: 'performance',
    },
  ],
  addNotification: (notification) => set((state) => ({ 
    notifications: [...state.notifications, notification] 
  })),
  markNotificationAsRead: (id) => set((state) => ({
    notifications: state.notifications.map(notif => 
      notif.id === id ? { ...notif, read: true } : notif
    )
  })),

  // Platforms
  platforms: [
    {
      id: '1',
      name: 'VYBE COLLECTIVE',
      description: 'Premier music collective connecting artists worldwide. We\'re actively scouting at tonight\'s event!',
      instagram: 'vybecollective',
      website: 'https://vybecollective.com',
      contactEmail: 'booking@vybecollective.com',
      featured: true,
    },
    {
      id: '2',
      name: 'UNDERGROUND SOUNDS',
      description: 'Platform for emerging hip-hop and R&B artists. Submit your tracks for playlist consideration.',
      instagram: 'undergroundsounds',
      website: 'https://undergroundsounds.com',
      contactEmail: 'contact@undergroundsounds.com',
      featured: true,
    },
    {
      id: '3',
      name: 'FLORIDA MUSIC NETWORK',
      description: 'Connecting artists across the Sunshine State. Book shows, find collaborators, grow your fanbase.',
      instagram: 'floridamusicnetwork',
      website: 'https://floridamusicnetwork.com',
      contactEmail: 'info@floridamusicnetwork.com',
      featured: false,
    },
    {
      id: '4',
      name: 'CYPHER KINGS PODCAST',
      description: 'Weekly podcast featuring the best freestyle artists. Tonight\'s performers get priority interviews!',
      instagram: 'cypherkingspod',
      website: 'https://cypherkings.com',
      contactEmail: 'bookings@cypherkings.com',
      featured: true,
    },
  ],
  setPlatforms: (platforms) => set({ platforms }),
}));