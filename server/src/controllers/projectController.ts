import { Request, Response } from 'express';
import { Project } from '../models/Project';
import { ProjectSubmission } from '../models/Project';
import { AuthRequest } from '../middleware/auth';

import mongoose from 'mongoose';
import { fallbackStore } from '../services/fallbackStore';

export const getProjects = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    let enriched: any[] = [];
    if (mongoose.connection.readyState === 1) {
      try {
        const { difficulty, careerId } = req.query;
        const filter: any = {};

        if (difficulty && difficulty !== 'All') filter.difficulty = difficulty;
        if (careerId) filter.career = careerId;

        const projects = await Project.find(filter)
          .populate('skills', 'name category')
          .populate('career', 'name slug');

        let userSubmissions: any[] = [];
        if (req.user) {
          userSubmissions = await ProjectSubmission.find({ user: req.user._id });
        }

        const subMap = new Map<string, any>();
        userSubmissions.forEach((sub) => {
          subMap.set(sub.project.toString(), sub);
        });

        enriched = projects.map((p) => {
          const sub = subMap.get(p._id.toString());
          return {
            ...p.toObject(),
            submissionStatus: sub ? sub.status : 'Not Started',
            submission: sub || null,
          };
        });
      } catch (e) {
        enriched = [];
      }
    }

    if (!enriched || enriched.length === 0) {
      enriched = fallbackStore.getProjects().map((p) => ({
        ...p,
        submissionStatus: 'Not Started',
        submission: null,
      }));
    }

    res.json({ success: true, projects: enriched });
  } catch (err: any) {
    res.json({
      success: true,
      projects: fallbackStore.getProjects().map((p) => ({
        ...p,
        submissionStatus: 'Not Started',
        submission: null,
      })),
    });
  }
};

export const getProjectById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const project = await Project.findById(id).populate('skills', 'name category').populate('career', 'name');
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }
    res.json({ success: true, project });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch project.' });
  }
};

export const submitProject = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const { id } = req.params;
    const { description, githubUrl, demoUrl } = req.body;

    if (!githubUrl || !githubUrl.trim()) {
      res.status(400).json({ success: false, message: 'A valid GitHub repository URL is required.' });
      return;
    }

    // URL validation
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-]*)*\/?$/i;
    if (!urlPattern.test(githubUrl.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid GitHub URL format (e.g., https://github.com/username/project).' });
      return;
    }

    if (demoUrl && demoUrl.trim() && !urlPattern.test(demoUrl.trim())) {
      res.status(400).json({ success: false, message: 'Please provide a valid live demo URL.' });
      return;
    }

    const project = await Project.findById(id);
    if (!project) {
      res.status(404).json({ success: false, message: 'Project not found.' });
      return;
    }

    const submission = await ProjectSubmission.findOneAndUpdate(
      { user: req.user._id, project: project._id },
      {
        user: req.user._id,
        project: project._id,
        description: description ? description.trim() : 'Project submitted for evaluation',
        githubUrl: githubUrl.trim(),
        demoUrl: demoUrl ? demoUrl.trim() : '',
        status: 'Submitted',
        submittedAt: new Date(),
      },
      { upsert: true, new: true }
    );

    res.json({
      success: true,
      message: 'Project submission recorded successfully.',
      submission,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to submit project.' });
  }
};

export const getUserProjectSubmissions = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Unauthorized.' });
      return;
    }

    const submissions = await ProjectSubmission.find({ user: req.user._id })
      .populate('project', 'title difficulty skills')
      .sort({ submittedAt: -1 });

    res.json({ success: true, submissions });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Failed to fetch project submissions.' });
  }
};
