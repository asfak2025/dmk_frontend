

// "use client";

// import React, { useState, useEffect, useMemo } from "react";
// import Container from "@/components/ui/container";
// import PageTitle from "@/components/ui/pageTitle";
// import { useAppContext } from "@/hooks/context";
// import { apiHeader } from "@/lib/utils";
// import { getFromLocalStorage } from "@/components/encryption/encryption";
// import { useRouter } from "next/navigation";
// import Alert from "@/components/alert/alert";
// import { useAlert } from "@/hooks/alertHook";
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
// import { Facebook, Twitter, Linkedin, Instagram, FileText } from "lucide-react";
// import { Card, CardContent } from "@/components/ui/card";
// import { useLogOut } from "@/hooks/useLogout";

// interface UserProfile {
//   name: string;
//   companyName: string;
//   companyEmail: string;
//   companyPhone: string;
//   companyWebsite: string;
//   volumeCount: number;
//   companySize: string;
//   companyType: string;
//   companyAddress: {
//     street: string;
//     city: string;
//     state: string;
//     country: string;
//     zipCode: string;
//     area: string;
//   };
//   directorName: string;
//   directorPhone: string;
//   directorEmail: string;
//   directorProof: string;
//   companyProof: string;
//   taxRegistration: string;
//   certOfIncorporation: string;
//   plan: {
//     planName?: string;
//     planId?: string;
//     planPrice?: string;
//     planDuration?: string;
//     planStatus?: string;
//     planFeatures?: string[];
//     planCreatedAt?: string;
//     planUpdatedAt?: string;
//   };
// }

// const Page = () => {
//   const { alert, showAlert, hideAlert } = useAlert();
//   const { URL } = useAppContext();
//   const logOut = useLogOut();
//   const router = useRouter();
//   const header = useMemo(() => apiHeader(), []);
//   const [isLoading, setIsLoading] = useState(true);
//   const [user, setUser] = useState<UserProfile | null>(null);

//   useEffect(() => {
//     const fetchProfile = async () => {
//       if (!header) {
//         logOut();
//         return;
//       }
//       const orgId = getFromLocalStorage("orgId");
//       try {
//         const response = await fetch(`${URL}/users/${orgId}`, {
//           method: "GET",
//           headers: header,
//         });
//         if (!response.status || response.status !== 200) {
//           if (response.status === 401) {
//             logOut();
//           }
//           showAlert(`Server responded with ${response.status}: ${response.statusText}`, "error");
//           return;
//         }
//         const data: UserProfile = await response.json();
//         setUser(data);
//       } catch (err: any) {
//         showAlert(err.message || "Something went wrong.", "error");
//       } finally {
//         setIsLoading(false);
//       }
//     };
//     fetchProfile();
//   }, []);

//   const getInitial = (name: string) => name?.charAt(0).toUpperCase();


//   const renderFileLink = (label: string, url?: string) => (
//     url ? (
//       <div className="text-center">
//         <a
//           href={url}
//           target="_blank"
//           rel="noopener noreferrer"
//           download
//           className="flex flex-col items-center justify-center gap-2 text-sm text-gray-800 hover:text-indigo-600"
//         >
//           <FileText className="w-8 h-8 text-gray-700" />
//           {label}
//         </a>
//       </div>
//     ) : (
//       <div className="text-center text-sm text-gray-400">{label} not available</div>
//     )
//   );

//   return (
//     <div className="border border-gray-300 shadow-sm bg-transparent px-10 min-h-screen py-10">
//       <Container>
//         <PageTitle title="Profile" description="Information about the user" />
//         {isLoading ? (
//           <div className="text-center py-10 text-black animate-pulse">Loading profile...</div>
//         ) : (
//           user && (
//             <div className="max-w-7xl mx-auto space-y-8">
//               <div className="bg-white rounded-2xl shadow-lg p-8 flex flex-col md:flex-row items-center justify-between gap-6">
//                 <div className="flex items-center gap-5">
//                   <div className="relative w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg ring-2 ring-indigo-300">
//                     <span className="text-3xl font-extrabold text-white drop-shadow">
//                       {getInitial(user.companyName)}
//                     </span>
//                   </div>
//                   <div>
//                     <h2 className="text-3xl font-bold text-black">{user.companyName}</h2>
//                     <h2 className="text-sm text-gray-500">{user.companyEmail}</h2>
//                   </div>
//                 </div>
//                 <div className="flex space-x-3">
//                   {[Facebook, Twitter, Linkedin, Instagram].map((Icon, i) => (
//                     <a key={i} href="#" className="p-2 rounded-full bg-blue-50 hover:bg-blue-100 transition shadow">
//                       <Icon className="w-5 h-5 text-blue-600" />
//                     </a>
//                   ))}
//                 </div>
//               </div>
//               <Card className="border border-gray-200">
//                 <CardContent className="p-6">
//                   <Tabs defaultValue="company" className="w-full">
//                     <TabsList className="flex w-full justify-between bg-gray-100 p-1.5 rounded-lg gap-2">
//                       {[
//                         { tab: "company", label: "Company Info" },
//                         { tab: "director", label: "Director Info" },
//                         { tab: "plan", label: "Plan Details" },
//                         { tab: "documents", label: "Documentation" },
//                       ].map(({ tab, label }) => (
//                         <TabsTrigger
//                           key={tab}
//                           value={tab}
//                           className="flex-1 py-2 rounded-md text-black data-[state=active]:bg-black data-[state=active]:text-white data-[state=active]:shadow-md hover:bg-gray-200 transition"
//                         >
//                           {label}
//                         </TabsTrigger>
//                       ))}
//                     </TabsList>

//                      <TabsContent value="company" className="mt-6">
//                        <div className="grid md:grid-cols-2 gap-6 mb-8">
//                          <div>
//                            <h3 className="text-sm font-medium text-black">Company Name</h3>
//                            <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.companyName}</p>
//                          </div>
//                          <div>
//                            <h3 className="text-sm font-medium text-black">Company Email</h3>
//                          <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.companyEmail}</p>
//                          </div>
//                          <div>
//                            <h3 className="text-sm font-medium text-black">Phone</h3>
//                            <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.companyPhone}</p>
//                          </div>
//                            <div>
//                            <h3 className="text-sm font-medium text-black">Company Type</h3>
//                            <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.companyType}</p>
//                          </div>
//                            <div>
//                            <h3 className="text-sm font-medium text-black">Company Size</h3>
//                            <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.companySize}</p>
//                          </div>
//                            <div>
//                            <h3 className="text-sm font-medium text-black">Company Count</h3>
//                            <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.volumeCount}</p>
//                          </div>
//                          <div>
//                           <h3 className="text-sm font-medium text-black">Website</h3>
//                            <a
//                             href={user.companyWebsite}
//                             target="_blank"
//                             className="mt-1 text-sm text-indigo-600 hover:underline block"
//                           >
//                             {user.companyWebsite}
//                           </a>
//                         </div>
//                       </div>
//                       <div className="border rounded-md p-4 bg-gray-200">
//                         <h3 className="text-md font-semibold text-black mb-3">Company Address</h3>
//                         <p className="text-sm text-gray-800">
//                           {user.companyAddress.street}, {user.companyAddress.area},<br />
//                           {user.companyAddress.city} - {user.companyAddress.zipCode},<br />
//                           {user.companyAddress.state}, {user.companyAddress.country}
//                         </p>
//                       </div>
//                     </TabsContent>

//                      <TabsContent value="director" className="mt-6">
//                       <div className="grid md:grid-cols-2 gap-6">
//                         <div>
//                           <h3 className="text-sm font-medium text-black">Director Name</h3>
//                           <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.directorName}</p>
//                         </div>
//                         <div>
//                           <h3 className="text-sm font-medium text-black">Director Email</h3>
//                           <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.directorEmail}</p>
//                         </div>
//                         <div>
//                           <h3 className="text-sm font-medium text-black">Director Phone</h3>
//                           <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.directorPhone}</p>
//                         </div>
//                         <div>
//                           <h3 className="text-sm font-medium text-black">Director Proof</h3>
//                           {renderFileLink("Director Proof", user.directorProof)}</div>
//                       </div>
//                     </TabsContent>

                    
// <TabsContent value="plan" className="mt-6">
//                        {user.plan && Object.keys(user.plan).length > 0 ? (
//                         <div className="grid md:grid-cols-2 gap-6">
//                           <div className="space-y-4">
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Plan Name</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.plan.planName || "N/A"}</p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Plan ID</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.plan.planId || "N/A"}</p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Price</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.plan.planPrice || "N/A"}</p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Duration</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.plan.planDuration || "N/A"}</p>
//                             </div>
//                           </div>
//                           <div className="space-y-4">
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Status</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">{user.plan.planStatus || "N/A"}</p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Features</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">
//                                 {user.plan.planFeatures?.length ? user.plan.planFeatures.join(", ") : "N/A"}
//                               </p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Created At</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">
//                                 {new Date(user.plan.planCreatedAt).toLocaleString()}
//                               </p>
//                             </div>
//                             <div>
//                               <h3 className="text-sm font-medium text-black">Updated At</h3>
//                               <p className="mt-1 text-sm text-gray-900 bg-gray-200 p-3 rounded-md">
//                                 {new Date(user.plan.planUpdatedAt).toLocaleString()}
//                               </p>
//                             </div>
//                           </div>
//                         </div>
//                       ) : (
//                         <div className="text-center py-10">
//                           <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-gray-100">
//                             <svg className="h-6 w-6 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//                             </svg>
//                           </div>
//                           <h3 className="mt-3 text-sm font-medium text-gray-900">No active plan</h3>
//                           <p className="mt-1 text-sm text-black">Get started by selecting a plan that fits your needs.</p>
//                         </div>
//                       )}
//                     </TabsContent>
// <TabsContent value="documents" className="mt-6">
//                       <div className="grid grid-cols-3 gap-6">
//                         <div>{renderFileLink("Company Proof", user.companyProof)}</div>
//                         <div>{renderFileLink("Tax Registration", user.taxRegistration)}</div>
//                         <div>{renderFileLink("Certificate of Incorporation", user.certOfIncorporation)}</div>
                       
//                       </div>
//                     </TabsContent>
//                   </Tabs>
//                 </CardContent>
//               </Card>
//             </div>
//           )
//         )}
//         <Alert alert={alert} hideAlert={hideAlert} />
//       </Container>
//     </div>
//   );
// };

// export default Page;

'use client';

import React, { useState, useEffect } from "react";
import { User, Mail, Shield, Key, Building2, Edit2, Save, X, Eye, EyeOff } from "lucide-react";
import { useSession } from "next-auth/react";

interface UserProfile {
  memberEmail: string;
  password: string;
  role: string[];
  orgLogo: string;
  memberId: string;
}

interface ContainerProps {
  children: React.ReactNode;
}

interface PageTitleProps {
  title: string;
  description: string;
}

const Container: React.FC<ContainerProps> = ({ children }) => (
  <div className="max-w-6xl mx-auto">{children}</div>
);

const PageTitle: React.FC<PageTitleProps> = ({ title, description }) => (
  <div className="mb-8">
    <h1 className="text-3xl font-bold text-gray-900 mb-2">{title}</h1>
    <p className="text-gray-500">{description}</p>
  </div>
);

const Page: React.FC = () => {
  const { data: session, status } = useSession();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [editedUser, setEditedUser] = useState<UserProfile | null>(null);

  useEffect(() => {
    if (status === "authenticated" && session) {
      const userData: UserProfile = {
        memberEmail: session?.memberEmail || "",
        password: session?.password || "",
        role: session?.role || [],
        orgLogo: session?.orgLogo || "",
        memberId: session?.memberId || "",
      };
      setUser(userData);
      setEditedUser(userData);
    }
  }, [session, status]);

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleCancel = () => {
    setEditedUser(user);
    setIsEditing(false);
  };

  const handleSave = () => {
    // Here you would make an API call to update the user
    console.log("Saving user data:", editedUser);
    setUser(editedUser);
    setIsEditing(false);
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedUser) {
      setEditedUser({
        ...editedUser,
        [field]: value,
      });
    }
  };

  // Loading state
  if (status === "loading") {
    return (
      <div className="bg-gray-50 px-10 min-h-screen py-10">
        <Container>
          <PageTitle title="Profile" description="Information about the user" />
          <div className="flex items-center justify-center py-20">
            <div className="w-12 h-12 border-4 border-gray-900 border-t-transparent rounded-full animate-spin"></div>
          </div>
        </Container>
      </div>
    );
  }

  // Unauthenticated state
  if (status === "unauthenticated") {
    return (
      <div className="bg-gray-50 px-10 min-h-screen py-10">
        <Container>
          <PageTitle title="Profile" description="Information about the user" />
          <div className="text-center py-20">
            <p className="text-gray-500">Please log in to view your profile</p>
          </div>
        </Container>
      </div>
    );
  }

  // No user data state
  if (!user || !editedUser) {
    return (
      <div className="bg-gray-50 px-10 min-h-screen py-10">
        <Container>
          <PageTitle title="Profile" description="Information about the user" />
          <div className="text-center py-20">
            <p className="text-gray-500">No user data available</p>
          </div>
        </Container>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 px-10 min-h-screen py-10">
      <Container>
        <PageTitle title="Profile" description="Information about the user" />
        
        {/* Profile Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          {/* Header Section */}
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-8 py-8">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-6">
                {/* Organization Logo */}
                <div className="w-24 h-24 bg-white rounded-2xl overflow-hidden flex items-center justify-center shadow-lg ring-4 ring-white/20">
                  <img
                    src={user.orgLogo}
                    alt="Organization Logo"
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='96' height='96'%3E%3Crect fill='%23f3f4f6' width='96' height='96'/%3E%3Ctext x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' font-family='sans-serif' font-size='40' fill='%236b7280'%3E?%3C/text%3E%3C/svg%3E";
                    }}
                  />
                </div>
                <div>
                  <h2 className="text-2xl font-bold mb-1">{user.memberEmail.split('@')[0]}</h2>
                  <p className="text-gray-300 text-sm mb-2">{user.memberEmail}</p>
                  <div className="flex items-center gap-2">
                    <div className="px-3 py-1 bg-white/10 backdrop-blur-sm rounded-full flex items-center gap-2">
                      <Shield className="w-3.5 h-3.5" />
                      <span className="text-xs font-medium uppercase tracking-wider">
                        {user.role.length > 0 ? user.role.join(", ") : "No Role"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Edit/Save Buttons */}
              <div className="flex gap-3">
                {!isEditing ? (
                  <button
                    onClick={handleEdit}
                    className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                    Edit Profile
                  </button>
                ) : (
                  <>
                    <button
                      onClick={handleSave}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white text-gray-900 rounded-xl hover:bg-gray-100 transition-all font-medium shadow-lg"
                    >
                      <Save className="w-4 h-4" />
                      Save
                    </button>
                    <button
                      onClick={handleCancel}
                      className="flex items-center gap-2 px-5 py-2.5 bg-white/10 backdrop-blur-sm text-white rounded-xl hover:bg-white/20 transition-all font-medium"
                    >
                      <X className="w-4 h-4" />
                      Cancel
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Profile Details */}
          <div className="p-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">Account Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Email */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-gray-900/10 transition-colors">
                    <Mail className="w-4 h-4 text-gray-700" />
                  </div>
                  Email Address
                </label>
                {isEditing ? (
                  <input
                    type="email"
                    value={editedUser.memberEmail}
                    onChange={(e) => handleInputChange('memberEmail', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-base text-gray-900 font-medium px-4 py-3 bg-gray-50 rounded-xl">
                    {user.memberEmail || "Not provided"}
                  </p>
                )}
              </div>

              {/* Member ID */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-gray-900/10 transition-colors">
                    <User className="w-4 h-4 text-gray-700" />
                  </div>
                  Member ID
                </label>
                <p className="text-base text-gray-900 font-mono font-medium px-4 py-3 bg-gray-50 rounded-xl break-all">
                  {user.memberId || "Not provided"}
                </p>
              </div>

              {/* Password */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-gray-900/10 transition-colors">
                    <Key className="w-4 h-4 text-gray-700" />
                  </div>
                  Password
                </label>
                <div className="relative">
                  {isEditing ? (
                    <>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={editedUser.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gray-900/10 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </>
                  ) : (
                    <>
                      <p className="text-base text-gray-900 font-medium px-4 py-3 pr-12 bg-gray-50 rounded-xl">
                        {showPassword ? (user.password || "Not set") : "••••••••••"}
                      </p>
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center hover:bg-gray-900/10 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff className="w-4 h-4 text-gray-600" />
                        ) : (
                          <Eye className="w-4 h-4 text-gray-600" />
                        )}
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-gray-900/10 transition-colors">
                    <Shield className="w-4 h-4 text-gray-700" />
                  </div>
                  Role
                </label>
                <div className="flex gap-2">
                  {user.role && user.role.length > 0 ? (
                    user.role.map((role, index) => (
                      <span
                        key={index}
                        className="px-4 py-3 bg-gray-900 text-white rounded-xl text-sm font-medium uppercase tracking-wider"
                      >
                        {role}
                      </span>
                    ))
                  ) : (
                    <span className="px-4 py-3 bg-gray-200 text-gray-600 rounded-xl text-sm font-medium">
                      No role assigned
                    </span>
                  )}
                </div>
              </div>

              {/* Organization Logo URL */}
              {/* <div className="md:col-span-2 group">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-600 mb-3">
                  <div className="w-8 h-8 bg-gray-900/5 backdrop-blur-sm rounded-lg flex items-center justify-center group-hover:bg-gray-900/10 transition-colors">
                    <Building2 className="w-4 h-4 text-gray-700" />
                  </div>
                  Organization Logo URL
                </label>
                {isEditing ? (
                  <input
                    type="url"
                    value={editedUser.orgLogo}
                    onChange={(e) => handleInputChange('orgLogo', e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent transition-all"
                  />
                ) : (
                  <p className="text-sm text-gray-700 px-4 py-3 bg-gray-50 rounded-xl break-all">
                    {user.orgLogo || "Not provided"}
                  </p>
                )}
              </div> */}
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};

export default Page;