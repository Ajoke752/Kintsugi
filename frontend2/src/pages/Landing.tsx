import { Button } from "@/components/ui/button";
import { SignInButton, SignUpButton } from "@clerk/clerk-react";
import { Mic, Target, TrendingUp, Shield, Zap, Brain, Clock, CheckCircle2, ArrowRight, HelpCircle, ChevronDown } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const Landing = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <nav className="border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="w-8 h-8 text-accent" />
            <span className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
              Kintsugi
            </span>
          </div>
          <div className="flex gap-3">
            <SignInButton mode="modal">
              <Button variant="ghost" className="text-foreground hover:text-primary transition-colors">
                Sign In
              </Button>
            </SignInButton>
            <SignUpButton mode="modal">
              <Button className="bg-primary hover:bg-primary/90 shadow-glow-primary transition-all">
                Get Started
              </Button>
            </SignUpButton>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="inline-block animate-scale-in">
            <span className="text-accent text-sm font-semibold tracking-wide uppercase border border-accent/20 px-4 py-2 rounded-full bg-accent/5">
              Mental Fitness Command Center
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-foreground leading-tight">
            Turn Emotional Chaos Into{" "}
            <span className="bg-gradient-gold bg-clip-text text-transparent">
              Tactical Action
            </span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Voice-powered AI that translates emotional overwhelm into clear, actionable plans. 
            Built on proven <span className="text-foreground font-semibold">Behavioral Activation Therapy</span>.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
            <SignUpButton mode="modal">
              <Button 
                size="lg" 
                className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary text-lg px-8 py-6 group transition-all hover:scale-105"
              >
                <Mic className="mr-2 h-5 w-5 group-hover:animate-pulse" />
                Start Your First Debrief
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </SignUpButton>
          </div>

          {/* Trust Indicators */}
          <div className="flex flex-wrap justify-center gap-8 pt-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Voice-first accessibility</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Evidence-based therapy</span>
            </div>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-accent" />
              <span>Private & secure</span>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-gradient-card py-20 border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-5xl font-bold text-foreground">
              How It Works
            </h2>
            <p className="text-xl text-muted-foreground">
              Three simple steps to transform overwhelm into action
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            <StepCard
              number="01"
              icon={<Mic className="w-10 h-10" />}
              title="Speak Your Mind"
              description="Hit record and talk for 60 seconds. No typing, no structure needed. Just say what's on your mind."
            />
            <StepCard
              number="02"
              icon={<Brain className="w-10 h-10" />}
              title="AI Analysis"
              description="Our AI analyzes your tone, content, and emotional patterns to identify key stressors and priorities."
            />
            <StepCard
              number="03"
              icon={<Target className="w-10 h-10" />}
              title="Get Your Plan"
              description="Receive specific, tactical actions based on Behavioral Activation Therapy to move forward immediately."
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center space-y-4 mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground">
            Built Different
          </h2>
          <p className="text-xl text-muted-foreground">
            Not another journal app. A tactical command center for mental fitness.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <FeatureCard
            icon={<Mic className="w-8 h-8" />}
            title="Voice-First Interface"
            description="Designed for accessibility. No typing barriers. Just hit record and speak your truth."
            accent="primary"
          />
          <FeatureCard
            icon={<Zap className="w-8 h-8" />}
            title="Instant Action Plans"
            description="Get concrete, tactical steps within seconds. No vague advice. Just clear next actions."
            accent="accent"
          />
          <FeatureCard
            icon={<Clock className="w-8 h-8" />}
            title="60-Second Debriefs"
            description="Quick enough to do daily. Long enough to be meaningful. Build the habit that builds you."
            accent="primary"
          />
          <FeatureCard
            icon={<Brain className="w-8 h-8" />}
            title="AI-Powered Insights"
            description="Advanced sentiment analysis identifies patterns and stressors you might not see yourself."
            accent="accent"
          />
          <FeatureCard
            icon={<TrendingUp className="w-8 h-8" />}
            title="Track Your Progress"
            description="See your journey. Monitor completed actions. Watch patterns shift. Build momentum."
            accent="primary"
          />
          <FeatureCard
            icon={<Shield className="w-8 h-8" />}
            title="Private & Secure"
            description="Your voice data is processed securely and never shared. Your mental fitness is your business."
            accent="accent"
          />
        </div>
      </section>

      {/* Why Behavioral Activation */}
      <section className="bg-card border-y border-border py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <div className="inline-block">
                  <span className="text-accent text-sm font-semibold tracking-wide uppercase border border-accent/20 px-4 py-2 rounded-full bg-accent/5">
                    The Science
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                  Why Behavioral Activation Works
                </h2>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Research shows that <span className="text-foreground font-semibold">doing things changes how we feel</span> - 
                  often more effectively than traditional talk therapy alone.
                </p>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Kintsugi translates this proven approach into tactical action. Instead of passive reflection, 
                  you get specific steps to take <span className="text-foreground font-semibold">right now</span>.
                </p>
              </div>
              
              <div className="space-y-4">
                <BenefitItem text="Action-oriented instead of passive" />
                <BenefitItem text="Proven effectiveness in clinical research" />
                <BenefitItem text="Particularly effective for men's mental health" />
                <BenefitItem text="Builds momentum through small wins" />
                <BenefitItem text="Creates lasting behavioral change" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto">
          <div className="text-center space-y-4 mb-12">
            <div className="inline-flex items-center gap-2 text-accent">
              <HelpCircle className="w-8 h-8" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground">
              Frequently Asked Questions
            </h2>
            <p className="text-lg text-muted-foreground">
              Everything you need to know about Kintsugi
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-4">
            <AccordionItem value="item-1" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                Is my voice data private and secure?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Absolutely. Your voice recordings are encrypted in transit and at rest. We process your audio 
                to generate insights, but your raw audio is never stored permanently or shared with third parties. 
                Your mental fitness journey is completely private.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-2" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                How does the AI analyze my debriefs?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Our AI uses advanced natural language processing and sentiment analysis to understand both what 
                you say and how you say it. It identifies key themes, stressors, and emotional patterns, then 
                applies Behavioral Activation Therapy principles to generate specific, actionable steps tailored to your situation.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-3" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                What is Behavioral Activation Therapy?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Behavioral Activation Therapy (BAT) is an evidence-based approach that focuses on taking action 
                to improve how you feel. Research shows that doing things—even small things—can change your emotional 
                state more effectively than passive reflection alone. It's particularly effective for men's mental health 
                because it's action-oriented and tactical.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-4" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                Why only 60 seconds for a debrief?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                60 seconds is intentional. It's short enough to do daily without feeling like a burden, but long 
                enough to capture what's really going on. This constraint helps you focus on what matters most and 
                builds a sustainable daily habit. You can always do multiple debriefs if needed.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-5" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                Do I need to type anything or can I just use my voice?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                Kintsugi is designed to be completely voice-first. You never have to type unless you want to. 
                Just hit record, speak your mind, and let the AI handle the rest. This makes it accessible for 
                everyone, regardless of typing skills or literacy level.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="item-6" className="bg-card border border-border rounded-lg px-6">
              <AccordionTrigger className="text-left text-foreground hover:text-primary">
                Is this a replacement for therapy or counseling?
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                No. Kintsugi is a mental fitness tool, not a replacement for professional mental health treatment. 
                Think of it as a daily workout for your mental wellbeing. If you're dealing with serious mental 
                health challenges, we encourage you to work with a licensed therapist in addition to using Kintsugi.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>


      <section className="container mx-auto px-4 py-20 md:py-32">
        <div className="max-w-4xl mx-auto text-center space-y-8 bg-gradient-card border border-border rounded-2xl p-12 md:p-16 shadow-tactical">
          <h2 className="text-3xl md:text-5xl font-bold text-foreground leading-tight">
            Ready to Take Command?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Start your first 60-second debrief now. Turn today's chaos into tomorrow's action.
          </p>
          <SignUpButton mode="modal">
            <Button 
              size="lg" 
              className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-glow-primary text-lg px-10 py-6 group transition-all hover:scale-105"
            >
              <Mic className="mr-2 h-5 w-5 group-hover:animate-pulse" />
              Start Free Today
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </SignUpButton>
          <p className="text-sm text-muted-foreground">
            No credit card required • Takes less than 60 seconds to start
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card/50">
        <div className="container mx-auto px-4 py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
            {/* Brand Column */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Shield className="w-8 h-8 text-accent" />
                <span className="text-2xl font-bold bg-gradient-gold bg-clip-text text-transparent">
                  Kintsugi
                </span>
              </div>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Turn emotional chaos into tactical action. Your mental fitness command center.
              </p>
            </div>

            {/* Product Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Product</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#features" className="text-muted-foreground hover:text-primary transition-colors">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#how-it-works" className="text-muted-foreground hover:text-primary transition-colors">
                    How It Works
                  </a>
                </li>
                <li>
                  <a href="#science" className="text-muted-foreground hover:text-primary transition-colors">
                    The Science
                  </a>
                </li>
                <li>
                  <a href="#faq" className="text-muted-foreground hover:text-primary transition-colors">
                    FAQ
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Resources</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Mental Health Resources
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Research & Studies
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Blog
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="space-y-4">
              <h3 className="font-semibold text-foreground">Legal</h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Cookie Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                    Contact Us
                  </a>
                </li>
              </ul>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-8 border-t border-border">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
              <p>
                © {new Date().getFullYear()} Kintsugi. All rights reserved. Strength through adversity.
              </p>
              <p className="text-xs">
                Not a replacement for professional mental health treatment. If you're in crisis, please contact a mental health professional.
              </p>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

const StepCard = ({ 
  number, 
  icon, 
  title, 
  description 
}: { 
  number: string;
  icon: React.ReactNode; 
  title: string; 
  description: string;
}) => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-primary/5 rounded-lg blur-xl group-hover:bg-primary/10 transition-all" />
      <div className="relative bg-card border border-border rounded-lg p-8 hover:shadow-tactical transition-all hover:border-primary/50 space-y-4">
        <div className="text-accent/30 text-5xl font-bold">{number}</div>
        <div className="text-accent">{icon}</div>
        <h3 className="text-xl font-semibold text-foreground">{title}</h3>
        <p className="text-muted-foreground leading-relaxed">{description}</p>
      </div>
    </div>
  );
};

const FeatureCard = ({ 
  icon, 
  title, 
  description,
  accent
}: { 
  icon: React.ReactNode; 
  title: string; 
  description: string;
  accent: "primary" | "accent";
}) => {
  return (
    <div className="bg-card border border-border rounded-lg p-6 hover:shadow-tactical transition-all hover:border-primary/50 group space-y-4">
      <div className={`${accent === "accent" ? "text-accent" : "text-primary"} group-hover:scale-110 transition-transform`}>
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">{description}</p>
    </div>
  );
};

const BenefitItem = ({ text }: { text: string }) => {
  return (
    <div className="flex items-start gap-3 p-4 bg-background/50 rounded-lg border border-border/50">
      <CheckCircle2 className="w-5 h-5 text-accent mt-0.5 flex-shrink-0" />
      <span className="text-foreground">{text}</span>
    </div>
  );
};

export default Landing;
