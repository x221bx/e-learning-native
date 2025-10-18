# EduHub - E-Learning Platform

A comprehensive e-learning mobile application built with React Native and Expo, featuring course management, live streaming, user authentication, and admin panel.

## Features

### Core Functionality
- **Course Management**: Browse, search, and enroll in courses with detailed descriptions, ratings, and reviews
- **User Authentication**: Login, registration, and guest access with profile management
- **Live Streaming**: Real-time live classes and sessions
- **Messaging System**: In-app messaging and notifications
- **Favorites & Wishlist**: Save and organize preferred courses
- **Multi-language Support**: English and Arabic with RTL support
- **Offline Support**: Mock API for development and testing

### User Features
- **Home Dashboard**: Personalized course recommendations and statistics
- **Course Details**: Comprehensive course information with teacher profiles
- **Teacher Directory**: Browse and follow instructors
- **Schedule Management**: View and manage class schedules
- **Purchase System**: Secure course purchasing with cart functionality
- **Progress Tracking**: Monitor learning progress and completion

### Admin Panel
- **Dashboard**: Overview of platform statistics and analytics
- **Course Management**: Create, edit, publish, and manage courses
- **User Management**: Administer user accounts, approvals, and permissions
- **Category Management**: Organize courses by categories
- **Live Session Management**: Schedule and manage live streaming sessions
- **Settings**: Configure platform settings and preferences

## Technology Stack

- **Framework**: React Native with Expo
- **Navigation**: React Navigation (Stack, Tab, Drawer)
- **State Management**: Redux Toolkit
- **Styling**: Custom theme system with responsive design
- **Internationalization**: i18n-js with automatic translation
- **Icons**: Expo Vector Icons (Ionicons)
- **Async Storage**: Persistent data storage
- **Image Picker**: Expo Image Picker for profile customization
- **Localization**: Expo Localization for device language detection

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── admin/          # Admin-specific components
│   └── ...             # General components (buttons, cards, etc.)
├── screens/            # Application screens
│   ├── admin/          # Admin panel screens
│   ├── auth/           # Authentication screens
│   ├── course/         # Course-related components
│   └── ...             # Main app screens
├── navigation/         # Navigation configuration
├── services/           # API services and utilities
├── store/              # Redux store and slices
├── theme/              # Theme configuration and hooks
├── i18n/               # Internationalization files
├── mock/               # Mock data for development
├── utils/              # Utility functions
└── config.js           # Application configuration
```

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/x221bx/e-learning-native.git
   cd e-learning-native-admin
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure environment** (optional):
   - Set `EXPO_PUBLIC_API_URL` environment variable to point to your backend API
   - If not set, the app will use mock data for development

4. **Start the development server**:
   ```bash
   # For Android
   npm run android

   # For iOS
   npm run ios

   # For Web
   npm run web
   ```

## Configuration

### API Configuration
Edit `src/config.js` to configure the API endpoint:
```javascript
const config = {
  API_BASE_URL: process.env.EXPO_PUBLIC_API_URL || '', // Leave empty for mock API
  PAGE_SIZE: 10, // Items per page for pagination
};
```

### Environment Variables
- `EXPO_PUBLIC_API_URL`: Backend API base URL (optional)

## Key Components

### Navigation
- **TabsNavigator**: Main tab navigation with Home, Teachers, Live, Schedule, My Courses, Profile
- **DrawerNavigator**: Side menu with additional navigation options
- **Admin Stack**: Dedicated admin panel navigation

### State Management
- **User Slice**: Authentication and user profile state
- **UI Slice**: Theme, language, and UI preferences
- **Courses Slice**: Course data and enrollment management
- **Favorites/Wishlist/Cart Slices**: User preferences and shopping cart

### Services
- **API Service**: RESTful API client with retry logic and error handling
- **Mock API**: Development data provider when backend is unavailable
- **Auth Context**: Authentication state management

## Development

### Running Tests
```bash
npm test
```

### Building for Production
```bash
# Build for Android
expo build:android

# Build for iOS
expo build:ios

# Build for Web
expo build:web
```

### Code Quality
- ESLint configuration in `qodana.yaml`
- Prettier for code formatting
- TypeScript support planned for future versions

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Support

For support and questions:
- Create an issue on GitHub
- Contact the development team

---

**EduHub** - Empowering education through technology.
