import Link from "next/link"
import { Film, Facebook, Twitter, Instagram, Youtube } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-12 bg-background">
      <div className="container px-4 mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Film className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">CineVerse</span>
            </Link>
            <p className="text-muted-foreground mb-4">Explore, rate, and stream your favorite movies and TV series.</p>
            <div className="flex space-x-4">
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Facebook className="h-5 w-5" />
                <span className="sr-only">Facebook</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Twitter className="h-5 w-5" />
                <span className="sr-only">Twitter</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Instagram className="h-5 w-5" />
                <span className="sr-only">Instagram</span>
              </Link>
              <Link href="#" className="text-muted-foreground hover:text-primary">
                <Youtube className="h-5 w-5" />
                <span className="sr-only">YouTube</span>
              </Link>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Explore</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/movies" className="text-muted-foreground hover:text-primary">
                  Movies
                </Link>
              </li>
              <li>
                <Link href="/series" className="text-muted-foreground hover:text-primary">
                  TV Series
                </Link>
              </li>
              <li>
                <Link href="/genres" className="text-muted-foreground hover:text-primary">
                  Genres
                </Link>
              </li>
              <li>
                <Link href="/platforms" className="text-muted-foreground hover:text-primary">
                  Streaming Platforms
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Account</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/profile" className="text-muted-foreground hover:text-primary">
                  My Profile
                </Link>
              </li>
              <li>
                <Link href="/watchlist" className="text-muted-foreground hover:text-primary">
                  Watchlist
                </Link>
              </li>
              <li>
                <Link href="/purchases" className="text-muted-foreground hover:text-primary">
                  Purchase History
                </Link>
              </li>
              <li>
                <Link href="/settings" className="text-muted-foreground hover:text-primary">
                  Settings
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-muted-foreground hover:text-primary">
                  Help Center
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-muted-foreground hover:text-primary">
                  FAQ
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-muted-foreground hover:text-primary">
                  Contact Us
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-muted-foreground hover:text-primary">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-12 pt-8 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} CineVerse. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
