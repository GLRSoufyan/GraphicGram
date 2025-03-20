// ContentView.swift - Main view structure for iOS app

import SwiftUI

struct ContentView: View {
    @StateObject private var authViewModel = AuthViewModel()
    
    var body: some View {
        Group {
            if authViewModel.isAuthenticated {
                MainTabView()
                    .environmentObject(authViewModel)
            } else {
                AuthView()
                    .environmentObject(authViewModel)
            }
        }
    }
}

// Auth View
struct AuthView: View {
    @State private var isLogin = true
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        NavigationView {
            VStack(spacing: 20) {
                // Logo
                Text("Graphic Gram")
                    .font(.system(size: 36, weight: .bold))
                    .foregroundColor(.primary)
                
                // Toggle between login and signup
                Picker("Mode", selection: $isLogin) {
                    Text("Login").tag(true)
                    Text("Sign Up").tag(false)
                }
                .pickerStyle(SegmentedPickerStyle())
                .padding(.horizontal, 30)
                
                if isLogin {
                    LoginView()
                } else {
                    SignupView()
                }
                
                Spacer()
            }
            .padding()
            .navigationBarHidden(true)
        }
    }
}

// Main Tab View
struct MainTabView: View {
    @State private var selectedTab = 0
    @EnvironmentObject private var authViewModel: AuthViewModel
    
    var body: some View {
        TabView(selection: $selectedTab) {
            HomeView()
                .tabItem {
                    Image(systemName: "house.fill")
                    Text("Home")
                }
                .tag(0)
            
            ExploreView()
                .tabItem {
                    Image(systemName: "magnifyingglass")
                    Text("Explore")
                }
                .tag(1)
            
            NewPostView()
                .tabItem {
                    Image(systemName: "plus.square")
                    Text("Post")
                }
                .tag(2)
            
            NotificationsView()
                .tabItem {
                    Image(systemName: "heart")
                    Text("Activity")
                }
                .tag(3)
            
            ProfileView()
                .tabItem {
                    Image(systemName: "person.fill")
                    Text("Profile")
                }
                .tag(4)
        }
    }
}

// Home View (Feed)
struct HomeView: View {
    @StateObject private var feedViewModel = FeedViewModel()
    
    var body: some View {
        NavigationView {
            ScrollView {
                LazyVStack(spacing: 0) {
                    // Stories
                    StoriesView()
                        .padding(.vertical, 8)
                    
                    Divider()
                    
                    // Posts
                    if feedViewModel.isLoading {
                        ProgressView()
                            .padding()
                    } else if feedViewModel.posts.isEmpty {
                        Text("No posts yet. Follow users to see their content.")
                            .padding()
                            .foregroundColor(.secondary)
                    } else {
                        ForEach(feedViewModel.posts) { post in
                            PostView(post: post)
                            Divider()
                        }
                    }
                }
            }
            .navigationTitle("Graphic Gram")
            .navigationBarTitleDisplayMode(.inline)
            .toolbar {
                ToolbarItem(placement: .navigationBarLeading) {
                    Text("Graphic Gram")
                        .font(.title2)
                        .fontWeight(.bold)
                }
                
                ToolbarItem(placement: .navigationBarTrailing) {
                    Button(action: {
                        // Open messages
                    }) {
                        Image(systemName: "paperplane")
                    }
                }
            }
            .refreshable {
                await feedViewModel.fetchPosts()
            }
            .onAppear {
                feedViewModel.fetchPosts()
            }
        }
    }
}

// Post View
struct PostView: View {
    let post: Post
    @State private var isLiked = false
    @State private var isSaved = false
    @State private var showComments = false
    
    var body: some View {
        VStack(alignment: .leading, spacing: 8) {
            // Post header
            HStack {
                Image(post.userProfileImage)
                    .resizable()
                    .frame(width: 32, height: 32)
                    .clipShape(Circle())
                
                Text(post.username)
                    .fontWeight(.semibold)
                
                Spacer()
                
                Button(action: {
                    // Show options
                }) {
                    Image(systemName: "ellipsis")
                }
            }
            .padding(.horizontal)
            .padding(.vertical, 8)
            
            // Post image
            TabView {
                ForEach(post.images, id: \.self) { image in
                    Image(image)
                        .resizable()
                        .scaledToFill()
                }
            }
            .tabViewStyle(PageTabViewStyle())
            .frame(height: 400)
            
            // Action buttons
            HStack {
                Button(action: {
                    isLiked.toggle()
                }) {
                    Image(systemName: isLiked ? "heart.fill" : "heart")
                        .foregroundColor(isLiked ? .red : .primary)
                }
                
                Button(action: {
                    showComments.toggle()
                }) {
                    Image(systemName: "bubble.right")
                }
                
                Button(action: {
                    // Share post
                }) {
                    Image(systemName: "paperplane")
                }
                
                Spacer()
                
                Button(action: {
                    isSaved.toggle()
                }) {
                    Image(systemName: isSaved ? "bookmark.fill" : "bookmark")
                }
            }
            .padding(.horizontal)
            .font(.system(size: 20))
            
            // Likes
            Text("\(post.likeCount) likes")
                .fontWeight(.semibold)
                .padding(.horizontal)
            
            // Caption
            if !post.caption.isEmpty {
                HStack(alignment: .top) {
                    Text(post.username)
                        .fontWeight(.semibold)
                    
                    Text(post.caption)
                }
                .padding(.horizontal)
            }
            
            // Comments
            if post.commentCount > 0 {
                Button(action: {
                    showComments.toggle()
                }) {
                    Text("View all \(post.commentCount) comments")
                        .foregroundColor(.secondary)
                }
                .padding(.horizontal)
            }
            
            // Time
            Text(post.timeAgo)
                .font(.caption)
                .foregroundColor(.secondary)
                .padding(.horizontal)
                .padding(.bottom, 4)
        }
        .sheet(isPresented: $showComments) {
            CommentsView(postId: post.id)
        }
    }
}

// View Models
class AuthViewModel: ObservableObject {
    @Published var isAuthenticated = false
    @Published var user: User?
    @Published var isLoading = false
    @Published var error: String?
    
    func login(identifier: String, password: String) {
        isLoading = true
        error = nil
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.isLoading = false
            
            // Success
            if identifier.lowercased() == "test" && password == "password" {
                self.isAuthenticated = true
                self.user = User(id: "1", username: "test_user", fullName: "Test User")
            } else {
                self.error = "Invalid credentials"
            }
        }
    }
    
    func signup(email: String, username: String, fullName: String, password: String) {
        isLoading = true
        error = nil
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) {
            self.isLoading = false
            
            // Success
            if email.contains("@") && username.count >= 3 && password.count >= 6 {
                self.isAuthenticated = true
                self.user = User(id: "1", username: username, fullName: fullName)
            } else {
                self.error = "Invalid input. Please check your information."
            }
        }
    }
    
    func logout() {
        isAuthenticated = false
        user = nil
    }
}

class FeedViewModel: ObservableObject {
    @Published var posts: [Post] = []
    @Published var isLoading = false
    @Published var error: String?
    
    func fetchPosts() {
        isLoading = true
        
        // Simulate API call
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.0) {
            self.isLoading = false
            
            // Sample posts
            self.posts = [
                Post(
                    id: "1",
                    username: "user1",
                    userProfileImage: "profile1",
                    images: ["post1"],
                    caption: "Beautiful day!",
                    likeCount: 124,
                    commentCount: 8,
                    timeAgo: "2h ago"
                ),
                Post(
                    id: "2",
                    username: "user2",
                    userProfileImage: "profile2",
                    images: ["post2"],
                    caption: "Amazing views from my hike today",
                    likeCount: 237,
                    commentCount: 14,
                    timeAgo: "4h ago"
                )
            ]
        }
    }
}

// Models
struct User: Identifiable {
    let id: String
    let username: String
    let fullName: String
    var profilePicture: String = "default_profile"
    var bio: String = ""
    var isPrivate: Bool = false
    var followerCount: Int = 0
    var followingCount: Int = 0
    var postCount: Int = 0
}

struct Post: Identifiable {
    let id: String
    let username: String
    let userProfileImage: String
    let images: [String]
    let caption: String
    let likeCount: Int
    let commentCount: Int
    let timeAgo: String
}
