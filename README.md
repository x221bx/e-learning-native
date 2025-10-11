# E-Learning Platform

A comprehensive mobile and web e-learning application built with React Native and Expo, featuring course management, user authentication, and multi-language support.

## Features

### Authentication System
- **User Registration & Login**: Secure authentication with AsyncStorage
- **Role-Based Access**: Support for Students, Teachers, and Admins
- **Guest Mode**: Browse courses without authentication
- **Teacher Approval System**: Admin approval required for teacher accounts

### Course Management
- **Course Listing**: Browse courses with lazy loading
- **Course Details**: Comprehensive course information with ratings and reviews
- **Search & Filter**: Advanced search with category filtering
- **Course Enrollment**: Join and unenroll from courses
- **Progress Tracking**: Track course completion and progress

### Admin Panel
- **Course CRUD Operations**: Create, Read, Update, Delete courses
- **User Management**: Approve teacher accounts
- **Dashboard Analytics**: View platform statistics

### User Dashboard
- **My Courses**: View enrolled courses
- **Wishlist/Favorites**: Save courses for later using Redux
- **Profile Management**: Update user information
- **Learning Progress**: Track course completion

### Localization
- **Multi-Language Support**: English and Arabic
- **RTL Support**: Right-to-left layout for Arabic
- **Dynamic Language Switching**: Change language on the fly

### UI/UX Features
- **Responsive Design**: Optimized for mobile, tablet, and web
- **Modern UI**: Clean and intuitive interface with gradient effects
- **Dark Mode Ready**: Theme system prepared for dark mode
- **Smooth Animations**: Enhanced user experience with React Native Reanimated
- **Bottom Sheet**: Interactive modals using @gorhom/bottom-sheet

## Tech Stack

### Core
- **React Native**: 0.81.4
- **Expo**: 54.0.12
- **React**: 19.1.0

### State Management
- **Redux Toolkit**: 2.9.0
- **React Redux**: 9.2.0
- **Redux Persist**: 6.0.0

### Navigation
- **React Navigation**: 7.x
  - Bottom Tabs Navigator
  - Stack Navigator
  - Native Stack Navigator

### Storage
- **AsyncStorage**: 2.2.0 (Local data persistence)

### UI Components
- **Expo Linear Gradient**: Gradient effects
- **React Native Paper**: Material Design components
- **React Native Ratings**: Star rating component
- **Ionicons**: Icon library

### Internationalization
- **i18n-js**: 4.5.1
- **expo-localization**: 17.0.7

### Additional Features
- **Expo Image**: Optimized image loading
- **React Native Gesture Handler**: Touch interactions
- **React Native Reanimated**: Smooth animations
- **React Native Safe Area Context**: Safe area handling

## Project Structure

```
E-learing/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Accordion.jsx
│   │   ├── AppButton.jsx
│   │   ├── BannerPromo.jsx
│   │   ├── CategoryCard.js
│   │   ├── CourseCard.js
│   │   ├── LanguageSwitcher.js
│   │   ├── ProtectedRoute.js
│   │   └── ...
│   ├── screens/             # Application screens
│   │   ├── auth/            # Authentication screens
│   │   │   ├── WelcomeScreen.js
│   │   │   ├── LoginScreen.js
│   │   │   └── RegisterScreen.js
│   │   ├── admin/           # Admin panel screens
│   │   │   ├── AdminCoursesScreen.js
│   │   │   └── CourseFormScreen.js
│   │   ├── HomeScreen.js
│   │   ├── CourseDetailsScreen.js
│   │   ├── MyCoursesScreen.js
│   │   ├── ProfileScreen.js
│   │   └── ...
│   ├── store/               # Redux store
│   │   ├── slices/
│   │   │   ├── authSlice.js
│   │   │   ├── coursesSlice.js
│   │   │   └── wishlistSlice.js
│   │   ├── favoritesSlice.js
│   │   ├── userSlice.js
│   │   └── index.js
│   ├── services/            # API services
│   │   ├── api.js
│   │   └── mockApi.js
│   ├── i18n/                # Internationalization
│   │   ├── en.json
│   │   ├── ar.json
│   │   └── index.js
│   ├── utils/               # Utility functions
│   │   └── permissions.js
│   ├── mock/                # Mock data
│   │   └── data.js
│   ├── config.js            # App configuration
│   └── theme.js             # Theme configuration
├── App.js                   # Main app component
├── index.js                 # Entry point
├── package.json
└── README.md
```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator (for iOS development)
- Android Studio (for Android development)

### Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd E-learing
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Start the development server:
```bash
npm start
# or
expo start
```

4. Run on specific platform:
```bash
# iOS
npm run ios

# Android
npm run android

# Web
npm run web
```

## Configuration

### API Configuration
Edit `src/config.js` to configure API endpoints:

```javascript
export default {
  API_BASE_URL: 'https://your-api-url.com',
  PAGE_SIZE: 10,
};
```

### Theme Customization
Modify `src/theme.js` to customize colors, spacing, and other design tokens.

### Localization
Add or modify translations in:
- `src/i18n/en.json` (English)
- `src/i18n/ar.json` (Arabic)

## State Management

### Redux Slices

#### authSlice
- User authentication state
- Login/Logout actions
- User session management
- Guest mode support

#### coursesSlice
- Course data management
- CRUD operations
- Enrollment management

#### wishlistSlice
- Favorite courses
- Add/Remove from wishlist

#### userSlice
- User profile data
- Admin permissions
- Enrolled courses

## API Integration

The app supports both real API and mock data:

### Real API
Configure `API_BASE_URL` in `src/config.js`

### Mock API
Falls back to mock data when API is not configured

### API Endpoints
```
GET    /courses              - List courses
GET    /courses/:id          - Get course details
POST   /courses              - Create course (Admin)
PUT    /courses/:id          - Update course (Admin)
DELETE /courses/:id          - Delete course (Admin)
```

## Authentication Flow

1. **Welcome Screen**: Initial landing page
2. **Login/Register**: User authentication
3. **Guest Mode**: Browse without account
4. **Role-Based Access**: Different features for Students/Teachers/Admins

### User Roles

#### Student
- Browse and search courses
- Enroll in courses
- Track progress
- Manage wishlist

#### Teacher
- All student features
- Create courses (pending approval)
- Manage own courses

#### Admin
- All features
- Approve teachers
- Manage all courses
- View analytics

## Responsive Design

The app is optimized for:
- **Mobile**: iOS and Android phones
- **Tablet**: iPad and Android tablets
- **Web**: Desktop browsers

### Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Performance Optimizations

- **Lazy Loading**: Courses load incrementally
- **Image Optimization**: Using Expo Image
- **Memoization**: React.memo for expensive components
- **Virtual Lists**: FlatList for long lists
- **Code Splitting**: Dynamic imports for routes

## Testing

```bash
# Run tests
npm test

# Run with coverage
npm test -- --coverage
```

## Building for Production

### Android
```bash
expo build:android
```

### iOS
```bash
expo build:ios
```

### Web
```bash
npm run web
expo build:web
```

## Deployment

### Web Deployment
The web version can be deployed to:
- Vercel
- Netlify
- GitHub Pages
- Firebase Hosting

### Mobile Deployment
- **iOS**: App Store via TestFlight
- **Android**: Google Play Store

## Troubleshooting

### Common Issues

1. **Metro Bundler Issues**
```bash
expo start -c
```

2. **iOS Build Issues**
```bash
cd ios && pod install && cd ..
```

3. **Android Build Issues**
```bash
cd android && ./gradlew clean && cd ..
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Create an issue on GitHub
- Contact: support@elearning.com

## Roadmap

### Phase 1: Core Features ✅
- Authentication system
- Course management
- User dashboard
- Admin panel

### Phase 2: Enhanced Features ✅
- Wishlist/Favorites
- Localization (EN/AR)
- Responsive design
- Search & Filter

### Phase 3: Advanced Features (Upcoming)
- Video streaming
- Live classes
- Certificates
- Payment integration
- Social features
- Notifications
- Analytics dashboard

## Credits

Built with ❤️ us

## Version History

### v1.0.0 (Current)
- Initial release
- Authentication system
- Course management
- Multi-language support
- Responsive design
