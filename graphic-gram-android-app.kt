// MainActivity.kt - Main activity for Android app

package com.graphicgram.app

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.compose.foundation.layout.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.rememberNavController
import com.graphicgram.app.ui.theme.GraphicGramTheme
import com.graphicgram.app.viewmodels.AuthViewModel
import com.graphicgram.app.screens.*

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContent {
            GraphicGramTheme {
                GraphicGramApp()
            }
        }
    }
}

@Composable
fun GraphicGramApp() {
    val navController = rememberNavController()
    val authViewModel: AuthViewModel = viewModel()
    
    Surface(
        modifier = Modifier.fillMaxSize(),
        color = MaterialTheme.colorScheme.background
    ) {
        NavHost(navController = navController, startDestination = 
            if (authViewModel.isAuthenticated) "main" else "auth") {
            
            // Auth screens
            composable("auth") {
                AuthScreen(
                    onLoginSuccess = {
                        navController.navigate("main") {
                            popUpTo("auth") { inclusive = true }
                        }
                    },
                    authViewModel = authViewModel
                )
            }
            
            // Main app screens
            composable("main") {
                MainScreen(
                    onLogout = {
                        authViewModel.logout()
                        navController.navigate("auth") {
                            popUpTo("main") { inclusive = true }
                        }
                    }
                )
            }
        }
    }
}

// AuthScreen.kt
package com.graphicgram.app.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.PasswordVisualTransformation
import androidx.compose.ui.unit.dp
import com.graphicgram.app.viewmodels.AuthViewModel

@Composable
fun AuthScreen(
    onLoginSuccess: () -> Unit,
    authViewModel: AuthViewModel
) {
    var isLogin by remember { mutableStateOf(true) }
    
    Column(
        modifier = Modifier
            .fillMaxSize()
            .padding(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.Center
    ) {
        // App logo/title
        Text(
            text = "Graphic Gram",
            style = MaterialTheme.typography.headlineLarge
        )
        
        Spacer(modifier = Modifier.height(32.dp))
        
        // Toggle between login and signup
        Row {
            TextButton(
                onClick = { isLogin = true },
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    "Login",
                    color = if (isLogin) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
            
            TextButton(
                onClick = { isLogin = false },
                modifier = Modifier.weight(1f)
            ) {
                Text(
                    "Sign Up",
                    color = if (!isLogin) MaterialTheme.colorScheme.primary else MaterialTheme.colorScheme.onSurface.copy(alpha = 0.6f)
                )
            }
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        if (isLogin) {
            LoginForm(
                onLoginSuccess = onLoginSuccess,
                authViewModel = authViewModel
            )
        } else {
            SignupForm(
                onSignupSuccess = onLoginSuccess,
                authViewModel = authViewModel
            )
        }
    }
}

@Composable
fun LoginForm(
    onLoginSuccess: () -> Unit,
    authViewModel: AuthViewModel
) {
    var identifier by remember { mutableStateOf("") }
    var password by remember { mutableStateOf("") }
    
    Column(
        horizontalAlignment = Alignment.CenterHorizontally
    ) {
        OutlinedTextField(
            value = identifier,
            onValueChange = { identifier = it },
            label = { Text("Username or Email") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Email,
                imeAction = ImeAction.Next
            )
        )
        
        Spacer(modifier = Modifier.height(8.dp))
        
        OutlinedTextField(
            value = password,
            onValueChange = { password = it },
            label = { Text("Password") },
            modifier = Modifier.fillMaxWidth(),
            singleLine = true,
            visualTransformation = PasswordVisualTransformation(),
            keyboardOptions = KeyboardOptions(
                keyboardType = KeyboardType.Password,
                imeAction = ImeAction.Done
            )
        )
        
        Spacer(modifier = Modifier.height(16.dp))
        
        Button(
            onClick = {
                authViewModel.login(identifier, password)
                if (authViewModel.isAuthenticated) {
                    onLoginSuccess()
                }
            },
            modifier = Modifier.fillMaxWidth(),
            enabled = identifier.isNotBlank() && password.isNotBlank() && !authViewModel.isLoading
        ) {
            if (authViewModel.isLoading) {
                CircularProgressIndicator(
                    modifier = Modifier.size(24.dp),
                    color = MaterialTheme.colorScheme.onPrimary
                )
            } else {
                Text("Log In")
            }
        }
        
        Spacer(modifier = Modifier.height(8.dp))
        
        if (authViewModel.error != null) {
            Text(
                text = authViewModel.error ?: "",
                color = MaterialTheme.colorScheme.error,
                style = MaterialTheme.typography.bodySmall
            )
        }
        
        Spacer(modifier = Modifier.height(16.dp))
        
        TextButton(onClick = { /* Forgot Password */ }) {
            Text("Forgot Password?")
        }
    }
}

// MainScreen.kt
package com.graphicgram.app.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.*
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.NavDestination.Companion.hierarchy
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MainScreen(
    onLogout: () -> Unit
) {
    val navController = rememberNavController()
    
    Scaffold(
        bottomBar = {
            NavigationBar {
                val navBackStackEntry by navController.currentBackStackEntryAsState()
                val currentDestination = navBackStackEntry?.destination
                
                val items = listOf(
                    Screen.Home,
                    Screen.Explore,
                    Screen.NewPost,
                    Screen.Notifications,
                    Screen.Profile
                )
                
                items.forEach { screen ->
                    NavigationBarItem(
                        icon = { Icon(screen.icon, contentDescription = screen.label) },
                        label = { Text(screen.label) },
                        selected = currentDestination?.hierarchy?.any { it.route == screen.route } == true,
                        onClick = {
                            navController.navigate(screen.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        }
                    )
                }
            }
        }
    ) { innerPadding ->
        NavHost(
            navController = navController,
            startDestination = Screen.Home.route,
            modifier = Modifier.padding(innerPadding)
        ) {
            composable(Screen.Home.route) { HomeScreen() }
            composable(Screen.Explore.route) { ExploreScreen() }
            composable(Screen.NewPost.route) { NewPostScreen() }
            composable(Screen.Notifications.route) { NotificationsScreen() }
            composable(Screen.Profile.route) { ProfileScreen(onLogout = onLogout) }
        }
    }
}

sealed class Screen(val route: String, val label: String, val icon: androidx.compose.ui.graphics.vector.ImageVector) {
    object Home : Screen("home", "Home", Icons.Default.Home)
    object Explore : Screen("explore", "Explore", Icons.Default.Search)
    object NewPost : Screen("new_post", "Post", Icons.Default.Add)
    object Notifications : Screen("notifications", "Activity", Icons.Default.Favorite)
    object Profile : Screen("profile", "Profile", Icons.Default.Person)
}

// HomeScreen.kt
package com.graphicgram.app.screens

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.graphicgram.app.models.Post
import com.graphicgram.app.viewmodels.FeedViewModel
import androidx.lifecycle.viewmodel.compose.viewModel

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun HomeScreen(
    feedViewModel: FeedViewModel = viewModel()
) {
    LaunchedEffect(Unit) {
        feedViewModel.fetchPosts()
    }
    
    Scaffold(
        topBar = {
            TopAppBar(
                title = { Text("Graphic Gram") },
                actions = {
                    IconButton(onClick = { /* Open messages */ }) {
                        Icon(Icons.Default.Send, contentDescription = "Messages")
                    }
                }
            )
        }
    ) { innerPadding ->
        Column(modifier = Modifier.padding(innerPadding)) {
            // Stories row
            StoriesRow()
            
            Divider()
            
            // Posts feed
            if (feedViewModel.isLoading) {
                Box(modifier = Modifier.fillMaxSize()) {
                    CircularProgressIndicator(modifier = Modifier.align(androidx.compose.ui.Alignment.Center))
                }
            } else if (feedViewModel.posts.isEmpty()) {
                Box(modifier = Modifier.fillMaxSize()) {
                    Text(
                        "No posts yet. Follow users to see their content.",
                        modifier = Modifier
                            .align(androidx.compose.ui.Alignment.Center)
                            .padding(16.dp)
                    )
                }
            } else {
                LazyColumn {
                    items(feedViewModel.posts) { post ->
                        PostItem(post = post)
                        Divider()
                    }
                }
            }
        }
    }
}

@Composable
fun StoriesRow() {
    // Implementation of horizontal scrollable stories
}

@Composable
fun PostItem(post: Post) {
    var isLiked by remember { mutableStateOf(false) }
    var isSaved by remember { mutableStateOf(false) }
    
    Column(
        modifier = Modifier.fillMaxWidth()
    ) {
        // Post header
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(8.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Row {
                // Profile picture
                // Username
            }
            
            IconButton(onClick = { /* Show options */ }) {
                Icon(Icons.Default.MoreVert, contentDescription = "More options")
            }
        }
        
        // Post image
        // Post actions (like, comment, share, save)
        // Likes count
        // Caption
        // Comments
        // Timestamp
    }
}
