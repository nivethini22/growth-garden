import { useState } from "react";
import { motion } from "framer-motion";
import Chatbot from "@/components/Chatbot";
import HomeButton from "@/components/HomeButton";
import MuteButton from "@/components/MuteButton";
import useKeyboardNavigation from "@/hooks/useKeyboardNavigation";

interface Contact {
  id: number;
  name: string;
  phone: string;
  relationship: string;
}

const EmergencyContacts = () => {
  const [contacts, setContacts] = useState<Contact[]>([
    { id: 1, name: "National Suicide Prevention Lifeline", phone: "988", relationship: "Crisis Hotline" },
    { id: 2, name: "Crisis Text Line", phone: "Text HOME to 741741", relationship: "Text Support" },
    { id: 3, name: "SAMHSA Helpline", phone: "1-800-662-4357", relationship: "Mental Health" },
  ]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newContact, setNewContact] = useState({ name: "", phone: "", relationship: "" });
  useKeyboardNavigation();

  const handleAddContact = () => {
    if (!newContact.name || !newContact.phone) return;
    setContacts(prev => [
      ...prev,
      { ...newContact, id: Date.now() }
    ]);
    setNewContact({ name: "", phone: "", relationship: "" });
    setShowAddForm(false);
  };

  const handleDeleteContact = (id: number) => {
    setContacts(prev => prev.filter(c => c.id !== id));
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <Chatbot />
      <HomeButton />
      <MuteButton />
      
      <motion.div
        className="max-w-2xl mx-auto"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-4xl font-bold text-foreground mb-2 text-center">
          Emergency Contacts 📞
        </h1>
        <p className="text-muted-foreground text-center mb-8">
          Important numbers when you need support
        </p>

        {/* Contacts List */}
        <motion.div
          className="bg-card rounded-3xl p-6 shadow-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <div className="space-y-4">
            {contacts.map((contact, index) => (
              <motion.div
                key={contact.id}
                className="flex items-center justify-between p-4 bg-secondary rounded-xl"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 * index }}
              >
                <div>
                  <h3 className="font-semibold text-secondary-foreground">
                    {contact.name}
                  </h3>
                  <p className="text-primary font-medium">{contact.phone}</p>
                  <p className="text-sm text-muted-foreground">{contact.relationship}</p>
                </div>
                <div className="flex gap-2">
                  <motion.a
                    href={`tel:${contact.phone.replace(/\D/g, '')}`}
                    className="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </motion.a>
                  {contact.id > 3 && (
                    <motion.button
                      onClick={() => handleDeleteContact(contact.id)}
                      className="bg-destructive/20 text-destructive p-3 rounded-xl hover:bg-destructive/30 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                      </svg>
                    </motion.button>
                  )}
                </div>
              </motion.div>
            ))}
          </div>

          {/* Add Contact Form */}
          {showAddForm ? (
            <motion.div
              className="mt-6 p-4 bg-secondary/50 rounded-xl space-y-4"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
            >
              <input
                type="text"
                placeholder="Name"
                value={newContact.name}
                onChange={(e) => setNewContact(prev => ({ ...prev, name: e.target.value }))}
                className="w-full bg-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="tel"
                placeholder="Phone Number"
                value={newContact.phone}
                onChange={(e) => setNewContact(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full bg-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <input
                type="text"
                placeholder="Relationship"
                value={newContact.relationship}
                onChange={(e) => setNewContact(prev => ({ ...prev, relationship: e.target.value }))}
                className="w-full bg-input rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-primary/50"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleAddContact}
                  className="flex-1 bg-primary text-primary-foreground py-3 rounded-xl font-semibold hover:bg-primary/90 transition-colors"
                >
                  Add Contact
                </button>
                <button
                  onClick={() => setShowAddForm(false)}
                  className="px-6 bg-muted text-muted-foreground py-3 rounded-xl font-semibold hover:bg-muted/80 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          ) : (
            <motion.button
              onClick={() => setShowAddForm(true)}
              className="mt-6 w-full bg-primary/20 text-primary py-4 rounded-xl font-semibold hover:bg-primary/30 transition-colors flex items-center justify-center gap-2"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 5v14M5 12h14" />
              </svg>
              Add Personal Contact
            </motion.button>
          )}
        </motion.div>

        {/* Important Note */}
        <motion.div
          className="mt-6 bg-accent/50 rounded-2xl p-4 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <p className="text-sm text-accent-foreground">
            💚 If you're in crisis, please reach out to one of these resources. You are not alone.
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default EmergencyContacts;
