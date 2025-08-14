import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// export function Footer() {
//   return (
//     <footer className="border-t bg-background">
//       <div className="container mx-auto px-4 py-8">
//         <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
//           {/* Brand section */}
//           <div className="md:col-span-2">
//             <h3 className="text-lg font-semibold mb-4">Nabulas Healthcare</h3>
//             <p className="text-muted-foreground text-sm leading-relaxed">
//               Secure AI-powered healthcare voice assistant providing real-time medical consultations 
//               and personalized health insights. HIPAA-compliant and designed for your privacy.
//             </p>
//           </div>
          
//           {/* Navigation */}
//           <div>
//             <h4 className="font-medium mb-4">Navigation</h4>
//             <ul className="space-y-2 text-sm">
//               <li>
//                 <a href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
//                   About
//                 </a>
//               </li>
//               <li>
//                 <a href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
//                   Privacy Policy
//                 </a>
//               </li>
//               <li>
//                 <a href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
//                   Terms of Service
//                 </a>
//               </li>
//             </ul>
//           </div>
          
//           {/* Contact */}
//           <div>
//             <h4 className="font-medium mb-4">Support</h4>
//             <ul className="space-y-2 text-sm">
//               <li className="text-muted-foreground">Healthcare AI Assistant</li>
//               <li className="text-muted-foreground">24/7 Available</li>
//             </ul>
//           </div>
//         </div>
        
//         <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
//           <p>&copy; {new Date().getFullYear()} Nabulas Healthcare. All rights reserved.</p>
//         </div>
//       </div>
//     </footer>
//   );
// }
export function Footer() {
  return (
    <footer className="bg-background hidden md:block">
      <div className="px-4 md:px-6 mx-auto py-6 flex flex-col md:flex-row flex-wrap justify-between items-center gap-4 max-w-full overflow-x-auto">
        
        {/* Brand */}
        <div className="flex items-center gap-2">
          <img src="/nabius-favicon.png" alt="Nabulas Healthcare" className="h-6 w-6" />
          <span className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Nabulas Healthcare. All rights reserved.
          </span>
        </div>

        {/* Links + Social */}
        <div className="flex items-center gap-6 text-sm">
          <a href="/privacy" className="text-muted-foreground hover:text-primary transition-colors">Privacy</a>
          <a href="/terms" className="text-muted-foreground hover:text-primary transition-colors">Terms</a>
          <a href="/sitemap" className="text-muted-foreground hover:text-primary transition-colors">Sitemap</a>
          <a href="mailto:support@ennovat.com" className="text-muted-foreground hover:text-primary transition-colors">Support</a>

          {/* Social icons */}
          <div className="flex items-center gap-2">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="Facebook">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12S0 5.446 0 12.073C0 18.062 4.388 23.027 10.125 23.927v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
            </a>
            <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="X (Twitter)">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
            </a>
            <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors" title="LinkedIn">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452z"/></svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

