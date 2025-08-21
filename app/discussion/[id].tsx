import { router, useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { apiService, Discussion, Reply } from '../../services/api';

export default function DiscussionDetailScreen() {
  const { id } = useLocalSearchParams();
  const [discussion, setDiscussion] = useState<Discussion | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(true);
  const [replyContent, setReplyContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadDiscussion();
    }
  }, [id]);

  const loadDiscussion = async () => {
    try {
      setLoading(true);
      setError(null);
      const discussionData = await apiService.getDiscussion(Number(id));
      setDiscussion(discussionData);
      
      // Load replies
      const repliesData = await apiService.getReplies(Number(id));
      setReplies(Array.isArray(repliesData) ? repliesData : repliesData.results || []);
    } catch (err: any) {
      console.error('Error loading discussion:', err);
      setError('Failed to load discussion');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async () => {
    if (!replyContent.trim()) {
      Alert.alert('Error', 'Please enter a reply');
      return;
    }

    try {
      setSubmitting(true);
      await apiService.createReply(Number(id), replyContent.trim());
      setReplyContent('');
      Alert.alert('Success', 'Reply posted successfully!');
      // Reload replies
      loadDiscussion();
    } catch (err: any) {
      console.error('Error posting reply:', err);
      Alert.alert('Error', err?.message || 'Failed to post reply');
    } finally {
      setSubmitting(false);
    }
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#007AFF" />
        <Text style={styles.loadingText}>Loading Discussion...</Text>
      </View>
    );
  }

  if (error || !discussion) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Discussion not found'}</Text>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollView}>
        {/* Discussion Header */}
        <View style={styles.discussionHeader}>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>← Back to Forum</Text>
          </TouchableOpacity>
          
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{discussion.category?.name}</Text>
          </View>
          
          <Text style={styles.title}>{discussion.title}</Text>
          
          <View style={styles.authorInfo}>
            <Text style={styles.authorName}>
              by {discussion.author?.first_name} {discussion.author?.last_name} (@{discussion.author?.username})
            </Text>
            <Text style={styles.timestamp}>
              {formatTimeAgo(discussion.created_at)} • {discussion.views} views
            </Text>
          </View>
        </View>

        {/* Discussion Content */}
        <View style={styles.contentContainer}>
          <Text style={styles.content}>{discussion.content}</Text>
        </View>

        {/* Replies Section */}
        <View style={styles.repliesSection}>
          <Text style={styles.repliesTitle}>
            Replies ({replies.length})
          </Text>
          
          {replies.map((reply) => (
            <View key={reply.id} style={styles.replyContainer}>
              <View style={styles.replyHeader}>
                <Text style={styles.replyAuthor}>
                  {reply.author?.first_name} {reply.author?.last_name} (@{reply.author?.username})
                </Text>
                <Text style={styles.replyTimestamp}>
                  {formatTimeAgo(reply.created_at)}
                </Text>
              </View>
              <Text style={styles.replyContent}>{reply.content}</Text>
            </View>
          ))}
          
          {replies.length === 0 && (
            <Text style={styles.noReplies}>No replies yet. Be the first to reply!</Text>
          )}
        </View>
      </ScrollView>

      {/* Reply Input */}
      <View style={styles.replyInputContainer}>
        <TextInput
          style={styles.replyInput}
          placeholder="Write a reply..."
          value={replyContent}
          onChangeText={setReplyContent}
          multiline
          numberOfLines={3}
        />
        <TouchableOpacity
          style={[styles.replyButton, submitting && styles.replyButtonDisabled]}
          onPress={handleReply}
          disabled={submitting}
        >
          <Text style={styles.replyButtonText}>
            {submitting ? 'Posting...' : 'Reply'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#ff4444',
    textAlign: 'center',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  discussionHeader: {
    backgroundColor: 'white',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginBottom: 15,
  },
  backButtonText: {
    color: '#007AFF',
    fontSize: 16,
  },
  categoryBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  categoryText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  authorInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  authorName: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  timestamp: {
    fontSize: 12,
    color: '#999',
  },
  contentContainer: {
    backgroundColor: 'white',
    padding: 20,
    marginTop: 10,
  },
  content: {
    fontSize: 16,
    lineHeight: 24,
    color: '#333',
  },
  repliesSection: {
    marginTop: 10,
    backgroundColor: 'white',
    padding: 20,
  },
  repliesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  replyContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 15,
    marginBottom: 15,
  },
  replyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  replyAuthor: {
    fontSize: 14,
    fontWeight: '500',
    color: '#666',
  },
  replyTimestamp: {
    fontSize: 12,
    color: '#999',
  },
  replyContent: {
    fontSize: 15,
    lineHeight: 22,
    color: '#333',
  },
  noReplies: {
    fontSize: 14,
    color: '#999',
    fontStyle: 'italic',
    textAlign: 'center',
    padding: 20,
  },
  replyInputContainer: {
    backgroundColor: 'white',
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  replyInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 10,
    marginRight: 10,
    maxHeight: 100,
    fontSize: 16,
  },
  replyButton: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  replyButtonDisabled: {
    backgroundColor: '#ccc',
  },
  replyButtonText: {
    color: 'white',
    fontWeight: '600',
  },
});
