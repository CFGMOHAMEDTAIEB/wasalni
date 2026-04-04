import { Link, useNavigate } from "react-router";
import { Car, Menu, User, Crown, LogOut, MessageSquare, Bell } from "lucide-react";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import { useAuth } from "../context/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const renderNavLinks = () => {
    if (user?.role === "guest") {
      return (
        <>
          <Link to="/" className="text-sm hover:text-primary transition-colors">
            Rechercher
          </Link>
          <Link to="/premium" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
            <Crown className="size-4 text-yellow-500" />
            Premium
          </Link>
        </>
      );
    }

    if (user?.role === "owner") {
      return (
        <>
          <Link to="/" className="text-sm hover:text-primary transition-colors">
            Rechercher
          </Link>
          <Link to="/publish" className="text-sm hover:text-primary transition-colors">
            Publier un trajet
          </Link>
          <Link to="/dashboard" className="text-sm hover:text-primary transition-colors">
            Mes trajets
          </Link>
          <Link to="/premium" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
            <Crown className="size-4 text-yellow-500" />
            Premium
          </Link>
        </>
      );
    }

    // Normal user
    return (
      <>
        <Link to="/" className="text-sm hover:text-primary transition-colors">
          Rechercher
        </Link>
        <Link to="/dashboard" className="text-sm hover:text-primary transition-colors">
          Mes Réservations
        </Link>
        <Link to="/premium" className="text-sm hover:text-primary transition-colors flex items-center gap-1">
          <Crown className="size-4 text-yellow-500" />
          Premium
        </Link>
      </>
    );
  };

  const NavLinks = () => <>{renderNavLinks()}</>;

  return (
    <header className="border-b bg-white sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary text-white p-2 rounded-lg">
            <Car className="size-6" />
          </div>
          <span className="text-2xl font-bold text-primary">Wassalni</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <NavLinks />
        </nav>

        <div className="hidden md:flex items-center gap-3">
          {isAuthenticated ? (
            <>
              {/* Notifications for normal and owner users */}
              {user?.role !== "guest" && (
                <>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="size-4" />
                    <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                      2
                    </span>
                  </Button>
                  {user?.role === "normal" && (
                    <Button variant="ghost" size="icon" className="relative">
                      <MessageSquare className="size-4" />
                      <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                        1
                      </span>
                    </Button>
                  )}
                </>
              )}

              {/* User Avatar Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-1 rounded-lg hover:bg-gray-100 transition-colors">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.role === "owner" ? "Vehicle Owner" : user?.role === "normal" ? "Normal User" : "Guest"}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/dashboard")}>
                    <User className="size-4 mr-2" />
                    Mon Profil
                  </DropdownMenuItem>
                  {user?.role === "owner" && (
                    <DropdownMenuItem onClick={() => navigate("/publish")}>
                      <Car className="size-4 mr-2" />
                      Publier un Trajet
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout} className="text-red-600">
                    <LogOut className="size-4 mr-2" />
                    Déconnexion
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => navigate("/login")}
              >
                <User className="size-4 mr-2" />
                Connexion
              </Button>
              <Button size="sm" onClick={() => navigate("/login")}>
                S'inscrire
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="size-6" />
            </Button>
          </SheetTrigger>
          <SheetContent>
            <div className="flex flex-col gap-6 mt-8">
              <NavLinks />
              {isAuthenticated ? (
                <div className="pt-6 border-t flex flex-col gap-3">
                  <div className="flex items-center gap-3 pb-3">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user?.avatar} />
                      <AvatarFallback>{user?.name?.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-semibold text-sm">{user?.name}</p>
                      <p className="text-xs text-gray-500">
                        {user?.role === "owner" ? "Vehicle Owner" : user?.role === "normal" ? "Normal User" : "Guest"}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    onClick={handleLogout}
                    className="text-red-600 border-red-200 hover:bg-red-50"
                  >
                    <LogOut className="size-4 mr-2" />
                    Déconnexion
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col gap-3 pt-6 border-t">
                  <Button variant="outline" onClick={() => navigate("/login")}>
                    <User className="size-4 mr-2" />
                    Connexion
                  </Button>
                  <Button onClick={() => navigate("/login")}>S'inscrire</Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}
