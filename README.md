# mAsset - Digital Asset Management Platform

A modern, full-featured digital asset management platform built with Next.js, TypeScript, and Drizzle ORM. mAsset provides a complete solution for creators to upload, sell, and manage digital assets with integrated payment processing.

## 🚀 Features

### Core Functionality
- **User Authentication**: Secure Google OAuth integration with role-based access
- **Asset Management**: Upload, edit, and delete digital assets with approval workflow
- **Payment Processing**: Integrated PayPal payment gateway for secure transactions
- **Admin Dashboard**: Comprehensive admin panel for asset approval and platform management
- **User Dashboard**: Personal dashboard for managing uploaded assets and purchases
- **Gallery System**: Beautiful, searchable gallery with filtering and categorization
- **Purchase System**: Complete purchase flow with download access for purchased assets

### User Roles
- **Regular Users**: Upload assets, purchase from gallery, manage personal assets
- **Admins**: Approve/reject assets, manage categories, view platform statistics

### Advanced Features
- **Cloud Storage**: Cloudinary integration for secure file storage
- **Category Management**: Dynamic category system for asset organization
- **Search & Filter**: Advanced search and filtering capabilities
- **Responsive Design**: Mobile-first design with modern UI/UX
- **Real-time Updates**: Server actions with automatic page revalidation

## 🛠️ Tech Stack

### Frontend
- **Next.js 15** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful icon library
- **Shadcn/ui** - Modern component library

### Backend & Database
- **Drizzle ORM** - Type-safe database queries
- **PostgreSQL** - Robust relational database
- **Better Auth** - Modern authentication library
- **Server Actions** - Next.js server-side operations

### External Services
- **Cloudinary** - Cloud image storage and optimization
- **PayPal** - Payment processing and order management
- **Google OAuth** - User authentication

## 📁 Project Structure

```
masset/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── admin/             # Admin pages
│   │   │   ├── asset-approval/ # Asset approval workflow
│   │   │   └── settings/      # Admin settings & categories
│   │   ├── api/               # API routes
│   │   │   ├── auth/          # Authentication endpoints
│   │   │   ├── cloudinary/    # Cloudinary signature generation
│   │   │   └── paypal/        # PayPal payment processing
│   │   ├── dashboard/         # User dashboard
│   │   │   ├── assets/        # Asset management
│   │   │   └── purchases/     # Purchase history
│   │   ├── gallery/           # Public gallery
│   │   │   └── [id]/          # Individual asset pages
│   │   ├── login/             # Authentication pages
│   │   └── page.tsx           # Landing page
│   ├── components/            # Reusable components
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── dashboard/         # Dashboard components
│   │   ├── layout/            # Layout components
│   │   └── ui/                # UI component library
│   ├── lib/                   # Utility libraries
│   │   ├── auth.ts           # Authentication configuration
│   │   ├── db/               # Database configuration
│   │   └── utils.ts          # Utility functions
│   └── actions/               # Server actions
│       ├── admin-actions.ts   # Admin operations
│       ├── dashboard-actions.ts # User dashboard operations
│       └── payment-action.ts  # Payment processing
├── drizzle/                   # Database migrations
├── public/                    # Static assets
└── package.json              # Dependencies
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account
- PayPal developer account
- Google OAuth credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd masset
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/masset"
   
   # Authentication
   AUTH_SECRET="your-auth-secret"
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   
   # Cloudinary
   CLOUDINARY_CLOUD_NAME="your-cloud-name"
   CLOUDINARY_API_KEY="your-api-key"
   CLOUDINARY_API_SECRET="your-api-secret"
   
   # PayPal
   PAYPAL_CLIENT_ID="your-paypal-client-id"
   PAYPAL_CLIENT_SECRET="your-paypal-client-secret"
   PAYPAL_API_URL="https://api-m.sandbox.paypal.com"
   
   # Application
   APP_URL="http://localhost:3000"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"
   ```

4. **Set up the database**
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔧 Configuration

### Database Setup
The application uses PostgreSQL with Drizzle ORM. The schema includes:
- **Users**: User accounts and authentication
- **Assets**: Digital assets with metadata
- **Categories**: Asset categorization
- **Purchases**: Purchase records and history
- **Payments**: Payment transaction records

### Authentication
- Google OAuth integration for secure login
- Role-based access control (Admin/User)
- Session management with Better Auth

### Payment Processing
- PayPal integration for secure transactions
- Order creation and capture workflow
- Automatic purchase recording

## 📱 Key Features Explained

### Asset Upload & Management
- Drag-and-drop file upload with Cloudinary
- Automatic thumbnail generation
- Category assignment and metadata
- Approval workflow for quality control

### Gallery & Discovery
- Responsive grid layout
- Search and filtering capabilities
- Category-based organization
- Individual asset detail pages

### Purchase System
- Secure PayPal payment processing
- Automatic download access for purchased assets
- Purchase history tracking
- Receipt generation

### Admin Dashboard
- Asset approval workflow
- Category management
- Platform statistics
- User management

## 🎨 UI/UX Features

- **Modern Design**: Clean, professional interface
- **Responsive Layout**: Works on all device sizes
- **Loading States**: Smooth user feedback
- **Error Handling**: Graceful error management
- **Accessibility**: WCAG compliant components

## 🔒 Security Features

- **Authentication**: Secure OAuth integration
- **Authorization**: Role-based access control
- **Payment Security**: PCI-compliant PayPal integration
- **File Security**: Secure cloud storage with signed URLs
- **Data Protection**: Type-safe database operations

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy PostgreSQL integration
- **DigitalOcean**: App Platform support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support, email support@masset.com or create an issue in the repository.

## 🔮 Roadmap

- [ ] Advanced search filters
- [ ] Bulk asset operations
- [ ] Analytics dashboard
- [ ] Mobile app
- [ ] API documentation
- [ ] Multi-language support
- [ ] Advanced payment options
- [ ] Asset versioning

---

**Built with ❤️ using Next.js, TypeScript, and modern web technologies**