import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  Bitcoin, 
  Zap, 
  Users, 
  ArrowRight, 
  Shield, 
  Clock,
  Globe
} from "lucide-react";

const Index = () => {
  const navigate = useNavigate();
  const [lightningAddress, setLightningAddress] = useState("");
  const [groupCode, setGroupCode] = useState("");

  const handleGetStarted = () => {
    if (lightningAddress) {
      console.log("Getting started with:", lightningAddress);
      navigate("/dashboard");
    }
  };

  const handleJoinGroup = () => {
    if (groupCode.toLowerCase() === "btcpp") {
      console.log("Joining BTC++ group with code:", groupCode);
      navigate("/group/btcpp");
    } else if (groupCode) {
      console.log("Joining group:", groupCode);
      navigate("/group/1"); // Mock group ID for other codes
    }
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="container mx-auto px-4 py-20">
          <div className="text-center space-y-8">
            {/* Logo and Brand */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <div className="p-4 bg-gradient-bitcoin rounded-2xl animate-glow">
                <Bitcoin className="h-12 w-12 text-white animate-float" />
              </div>
              <h1 className="text-6xl font-bold bg-gradient-bitcoin bg-clip-text text-transparent">
                Splitoshi
              </h1>
            </div>

            {/* Tagline */}
            <div className="space-y-4">
              <h2 className="text-4xl font-bold text-foreground">
                Split expenses with Bitcoin Lightning
              </h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                The modern way to share costs in your group. Lightning-fast settlements, 
                denominated in satoshis, powered by the Bitcoin network.
              </p>
            </div>

            {/* Quick Start Cards */}
            <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto mt-16">
              <Card className="p-6 hover:shadow-bitcoin transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-bitcoin rounded-lg flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Create New Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Start tracking expenses with your friends or colleagues
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="your-address@wallet.com"
                      value={lightningAddress}
                      onChange={(e) => setLightningAddress(e.target.value)}
                      className="text-center"
                    />
                    <Button 
                      onClick={handleGetStarted}
                      disabled={!lightningAddress}
                      className="w-full bg-gradient-bitcoin hover:opacity-90"
                    >
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="p-6 hover:shadow-lightning transition-all duration-300">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto w-12 h-12 bg-gradient-lightning rounded-lg flex items-center justify-center mb-4">
                    <Zap className="h-6 w-6 text-white" />
                  </div>
                  <CardTitle>Join Existing Group</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground">
                    Enter a group code to join your friends
                  </p>
                  <div className="space-y-3">
                    <Input
                      placeholder="Group invite code"
                      value={groupCode}
                      onChange={(e) => setGroupCode(e.target.value)}
                      className="text-center"
                    />
                    <Button 
                      onClick={handleJoinGroup}
                      disabled={!groupCode}
                      className="w-full bg-gradient-lightning hover:opacity-90"
                    >
                      Join Group
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold mb-4">Why Choose Splitoshi?</h3>
            <p className="text-muted-foreground text-lg">
              The first expense splitting app built for the Bitcoin Lightning Network
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-lightning rounded-full flex items-center justify-center">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Lightning Fast</h4>
                <p className="text-muted-foreground">
                  Settle debts instantly with Lightning Network payments. No waiting, no fees.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-gradient-bitcoin rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h4 className="text-xl font-semibold">Trustless</h4>
                <p className="text-muted-foreground">
                  No need to trust a central authority. Your money, your keys, your control.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center p-6">
              <CardContent className="space-y-4">
                <div className="mx-auto w-16 h-16 bg-accent/20 rounded-full flex items-center justify-center">
                  <Globe className="h-8 w-8 text-accent" />
                </div>
                <h4 className="text-xl font-semibold">Global</h4>
                <p className="text-muted-foreground">
                  Works anywhere in the world. No currency conversion, no borders.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-2">0.001₿</div>
              <p className="text-muted-foreground">Average transaction fee</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">&lt;1s</div>
              <p className="text-muted-foreground">Settlement time</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">24/7</div>
              <p className="text-muted-foreground">Always available</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary mb-2">100%</div>
              <p className="text-muted-foreground">Open source</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white/80 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bitcoin className="h-5 w-5 text-primary" />
              <span className="font-semibold">Splitoshi</span>
            </div>
            <Badge variant="outline" className="text-xs">
              <Zap className="h-3 w-3 mr-1" />
              Lightning Network Enabled
            </Badge>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
